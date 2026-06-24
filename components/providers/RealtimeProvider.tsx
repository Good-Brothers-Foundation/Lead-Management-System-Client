"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";

type SubscriptionCallback = (data: any) => void;

interface RealtimeContextType {
  subscribe: (event: string, callback: SubscriptionCallback) => () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const subscribersRef = useRef<Record<string, Set<SubscriptionCallback>>>({});
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const eventSource = new EventSource("/api/realtime");
    eventSourceRef.current = eventSource;

    const handleEvent = (eventName: string, dataStr: string) => {
      try {
        const parsedData = JSON.parse(dataStr);
        const callbacks = subscribersRef.current[eventName];
        if (callbacks) {
          callbacks.forEach((cb) => cb(parsedData));
        }
      } catch (err) {
        console.error(`Error parsing data for event ${eventName}:`, err);
      }
    };

    const eventNames = [
      "lead_created",
      "lead_updated",
      "lead_deleted",
      "lead_locked",
      "lead_unlocked",
      "task_created",
      "task_updated",
      "task_deleted",
      "member_created",
      "member_updated",
      "member_deleted",
      "template_created",
      "template_updated",
      "template_deleted",
      "notification_created",
    ];

    eventNames.forEach((eventName) => {
      eventSource.addEventListener(eventName, (e) => {
        handleEvent(eventName, e.data);
      });
    });

    eventSource.onerror = (err) => {
      console.warn("[RealtimeProvider] SSE connection failed:", err);
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, []);

  const subscribe = (event: string, callback: SubscriptionCallback) => {
    if (!subscribersRef.current[event]) {
      subscribersRef.current[event] = new Set();
    }
    subscribersRef.current[event].add(callback);

    return () => {
      subscribersRef.current[event]?.delete(callback);
      if (subscribersRef.current[event]?.size === 0) {
        delete subscribersRef.current[event];
      }
    };
  };

  return (
    <RealtimeContext.Provider value={{ subscribe }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtimeSubscription(event: string, callback: SubscriptionCallback) {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error("useRealtimeSubscription must be used within a RealtimeProvider");
  }

  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const cb = (data: any) => callbackRef.current(data);
    const unsubscribe = context.subscribe(event, cb);
    return () => unsubscribe();
  }, [event, context]);
}
