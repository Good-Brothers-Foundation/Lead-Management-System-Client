"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRealtimeSubscription } from "@/components/providers/RealtimeProvider";

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Fallback polling at a reduced rate (every 60s)
    const interval = setInterval(fetchNotifications, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useRealtimeSubscription("notification_created", (newNotification: NotificationItem) => {
    setNotifications((prev) => {
      if (prev.some((n) => n._id === newNotification._id)) return prev;
      return [newNotification, ...prev];
    });
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/notifications/read-all", { method: "PUT" });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "PUT" });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      {/* Bell Icon Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-full transition-colors cursor-pointer flex items-center justify-center"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/80 bg-muted/20">
            <span className="font-bold text-sm text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-[#fd6102] hover:underline cursor-pointer flex items-center gap-1 border-none bg-transparent"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-75 overflow-y-auto divide-y divide-border/60">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleMarkAsRead(n._id)}
                  className={`p-4 hover:bg-muted/40 transition-colors cursor-pointer text-left relative flex flex-col gap-1 ${
                    !n.read ? "bg-muted/20 border-l-2 border-[#fd6102]" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-foreground leading-tight">{n.title}</span>
                    {n.link && (
                      <Link
                        href={n.link}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(n._id);
                          setIsOpen(false);
                        }}
                        className="text-muted-foreground hover:text-foreground shrink-0"
                        title="View details"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-normal">{n.message}</p>
                  <span className="text-[10px] text-muted-foreground/60 font-semibold mt-1">
                    {new Date(n.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-muted-foreground/80 font-medium">
                No notifications yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
