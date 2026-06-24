"use client";

import { useCallback, useEffect, useState } from "react";
import { leadsApi } from "@/lib/api/leads";
import { LeadFormData, LeadPayload } from "@/lib/types/lead";
import { useRealtimeSubscription } from "@/components/providers/RealtimeProvider";

export interface UseLeadsOptions {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
}

export function useLeads(options?: UseLeadsOptions) {
  const [leads, setLeads] = useState<LeadFormData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [timelines, setTimelines] = useState<string[]>([]);
  const [budgets, setBudgets] = useState<string[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  } | null>(null);

  const optionsKey = options ? JSON.stringify(options) : "";

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const parsedOptions = optionsKey ? JSON.parse(optionsKey) : undefined;
      const res = await leadsApi.getAll(parsedOptions);
      setLeads(res.data);
      setCategories(res.categories || []);
      setServices(res.services || []);
      setSources(res.sources || []);
      setTimelines(res.timelines || []);
      setBudgets(res.budgets || []);
      setStatusCounts(res.statusCounts || {});
      if (res.pagination) {
        setPagination(res.pagination);
      } else {
        setPagination(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load leads.");
    } finally {
      setIsLoading(false);
    }
  }, [optionsKey]);

  useEffect(() => {
    const loadLeads = window.setTimeout(() => {
      fetchLeads();
    }, 0);

    return () => {
      window.clearTimeout(loadLeads);
    };
  }, [fetchLeads]);

  // Subscribe to real-time events via the unified provider
  useRealtimeSubscription("lead_created", (newLead: LeadFormData) => {
    setLeads((prev) => {
      if (prev.some((l) => l._id === newLead._id)) return prev;
      return [newLead, ...prev];
    });
  });

  useRealtimeSubscription("lead_updated", (updatedLead: LeadFormData) => {
    setLeads((prev) =>
      prev.map((lead) => (lead._id === updatedLead._id ? updatedLead : lead))
    );
  });

  useRealtimeSubscription("lead_deleted", ({ id }: { id: string }) => {
    setLeads((prev) => prev.filter((lead) => lead._id !== id));
  });

  const createLead = useCallback(async (payload: LeadPayload) => {
    const createdLead = await leadsApi.create(payload);
    setLeads((prev) => [createdLead, ...prev]);
    return createdLead;
  }, []);

  const updateLead = useCallback(async (lead: LeadFormData) => {
    const id = lead._id;

    if (!id) {
      throw new Error("Cannot update lead because it does not have a MongoDB _id.");
    }

    const updatedLead = await leadsApi.update(id, lead);
    setLeads((prev) =>
      prev.map((item) =>
        item._id === id ? updatedLead : item
      )
    );
    return updatedLead;
  }, []);

  return {
    leads,
    categories,
    services,
    sources,
    timelines,
    budgets,
    statusCounts,
    isLoading,
    error,
    refetch: fetchLeads,
    createLead,
    updateLead,
    pagination,
  };
}
