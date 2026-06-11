"use client";

import { useCallback, useEffect, useState } from "react";
import { leadsApi } from "@/lib/api/leads";
import { LeadFormData, LeadPayload } from "@/lib/types/lead";

export function useLeads() {
  const [leads, setLeads] = useState<LeadFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await leadsApi.getAll();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load leads.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadLeads = window.setTimeout(() => {
      fetchLeads();
    }, 0);

    return () => window.clearTimeout(loadLeads);
  }, [fetchLeads]);

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
    isLoading,
    error,
    refetch: fetchLeads,
    createLead,
    updateLead,
  };
}
