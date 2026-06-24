import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/lib/models/Lead";
import Activity from "@/lib/models/Activity";
import Notification from "@/lib/models/Notification";
import { broadcast } from "@/lib/realtime";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const pageStr = searchParams.get("page");
    const limitStr = searchParams.get("limit");

    if (pageStr || limitStr) {
      const page = parseInt(pageStr || "1");
      const limit = parseInt(limitStr || "20");
      const status = searchParams.get("status");
      const category = searchParams.get("category");
      const search = searchParams.get("search");

      const query: any = { isDeleted: { $ne: true } };

      if (status && status !== "all") {
        query.status = status;
      }
      if (category && category !== "all") {
        query.category = category;
      }
      if (search && search.trim() !== "") {
        query.$or = [
          { fullName: { $regex: search.trim(), $options: "i" } },
          { category: { $regex: search.trim(), $options: "i" } },
          { address: { $regex: search.trim(), $options: "i" } },
          { service: { $regex: search.trim(), $options: "i" } },
          { phone: { $regex: search.trim(), $options: "i" } },
        ];
      }

      const totalLeads = await Lead.countDocuments(query);
      const totalPages = Math.ceil(totalLeads / limit);
      const skip = (page - 1) * limit;

      const [
        leads,
        distinctCategories,
        distinctServices,
        distinctSources,
        distinctTimelines,
        distinctBudgets,
        statusAgg
      ] = await Promise.all([
        Lead.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Lead.distinct("category", { isDeleted: { $ne: true } }),
        Lead.distinct("service", { isDeleted: { $ne: true } }),
        Lead.distinct("source", { isDeleted: { $ne: true } }),
        Lead.distinct("timeline", { isDeleted: { $ne: true } }),
        Lead.distinct("budget", { isDeleted: { $ne: true } }),
        Lead.aggregate([
          { $match: { isDeleted: { $ne: true } } },
          { $group: { _id: "$status", count: { $sum: 1 } } }
        ])
      ]);

      const categories = distinctCategories.filter((c): c is string => typeof c === "string" && c.trim() !== "").sort();
      const services = distinctServices.filter((s): s is string => typeof s === "string" && s.trim() !== "").sort();
      const sources = distinctSources.filter((s): s is string => typeof s === "string" && s.trim() !== "").sort();
      const timelines = distinctTimelines.filter((t): t is string => typeof t === "string" && t.trim() !== "").sort();
      const budgets = distinctBudgets.filter((b): b is string => typeof b === "string" && b.trim() !== "").sort();

      // Build statusCounts map: { all: 120, new: 40, contacted: 25, ... }
      const statusCounts: Record<string, number> = { all: totalLeads };
      statusAgg.forEach((item: { _id: string; count: number }) => {
        if (item._id) statusCounts[item._id] = item.count;
      });

      return NextResponse.json({
        success: true,
        data: leads,
        categories,
        services,
        sources,
        timelines,
        budgets,
        statusCounts,
        pagination: {
          total: totalLeads,
          totalPages,
          currentPage: page,
          limit,
        }
      });
    }

    const [
      leads,
      distinctCategories,
      distinctServices,
      distinctSources,
      distinctTimelines,
      distinctBudgets,
      statusAgg
    ] = await Promise.all([
      Lead.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }),
      Lead.distinct("category", { isDeleted: { $ne: true } }),
      Lead.distinct("service", { isDeleted: { $ne: true } }),
      Lead.distinct("source", { isDeleted: { $ne: true } }),
      Lead.distinct("timeline", { isDeleted: { $ne: true } }),
      Lead.distinct("budget", { isDeleted: { $ne: true } }),
      Lead.aggregate([
        { $match: { isDeleted: { $ne: true } } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ])
    ]);

    const categories = distinctCategories.filter((c): c is string => typeof c === "string" && c.trim() !== "").sort();
    const services = distinctServices.filter((s): s is string => typeof s === "string" && s.trim() !== "").sort();
    const sources = distinctSources.filter((s): s is string => typeof s === "string" && s.trim() !== "").sort();
    const timelines = distinctTimelines.filter((t): t is string => typeof t === "string" && t.trim() !== "").sort();
    const budgets = distinctBudgets.filter((b): b is string => typeof b === "string" && b.trim() !== "").sort();

    // Build statusCounts map: { all: 120, new: 40, contacted: 25, ... }
    const statusCounts: Record<string, number> = { all: leads.length };
    statusAgg.forEach((item: { _id: string; count: number }) => {
      if (item._id) statusCounts[item._id] = item.count;
    });

    return NextResponse.json({
      success: true,
      count: leads.length,
      data: leads,
      categories,
      services,
      sources,
      timelines,
      budgets,
      statusCounts,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch leads",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    if (body.source && body.source.trim().toLowerCase() === "google") {
      body.source = "google-maps";
    }

    const { fullName, phone, gmbLink, address } = body;

    let existingLead = null;

    // 1. Check by GMB Link
    if (gmbLink && gmbLink !== "N/A" && gmbLink.trim() !== "") {
      existingLead = await Lead.findOne({ gmbLink: gmbLink.trim() });
    }

    // 2. Check by Phone
    if (!existingLead && phone && phone !== "N/A" && phone.trim() !== "") {
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      if (cleanPhone.length >= 10) {
        const last10Digits = cleanPhone.slice(-10);
        const regexStr = last10Digits.split("").join("\\D*") + "$";
        existingLead = await Lead.findOne({
          phone: { $regex: new RegExp(regexStr) }
        });
      }
    }

    // 3. Check by Full Name and Address
    if (!existingLead && fullName && address && address !== "N/A" && address.trim() !== "") {
      const cleanName = fullName.replace(/[^a-zA-Z0-9]/g, "");
      const cleanAddress = address.replace(/[^a-zA-Z0-9]/g, "");
      
      if (cleanName && cleanAddress) {
        const nameRegex = new RegExp("^\\W*" + cleanName.split("").join("\\W*") + "\\W*$", "i");
        const addrRegex = new RegExp("^\\W*" + cleanAddress.split("").join("\\W*") + "\\W*$", "i");
        
        existingLead = await Lead.findOne({
          fullName: { $regex: nameRegex },
          address: { $regex: addrRegex }
        });
      }
    }

    if (existingLead) {
      return NextResponse.json(
        {
          success: false,
          message: `Lead already exists: a duplicate was found under the name "${existingLead.fullName}"`,
        },
        { status: 409 }
      );
    }

    const lead = await Lead.create(body);

    // Create lead activity audit log
    await Activity.create({
      leadId: lead._id,
      action: "Lead Created",
      performedBy: lead.assignedTo || "System / Admin",
      details: `Lead created for ${lead.fullName} requesting service: ${lead.service || "unspecified"}`,
    });

    // Create system notification
    const notification = await Notification.create({
      title: "New Lead Added 👤",
      message: `${lead.fullName} has been added to the pipeline for ${lead.service || "unspecified"}`,
      type: "lead_created",
      link: "/leads/all",
    });

    // Broadcast real-time events
    broadcast("lead_created", lead);
    broadcast("notification_created", notification);

    return NextResponse.json(
      { success: true, message: "Lead created successfully", data: lead },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create lead",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
