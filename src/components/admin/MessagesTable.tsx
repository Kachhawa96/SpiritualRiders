"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminContactMessageRecord } from "@/lib/db/admin-schema";
import { formatDeterministicDateTime } from "@/lib/date-utils";
import {
  updateContactMessageStatusAction,
  deleteContactMessageAction,
} from "@/app/admin/actions";
import { useAdminFeedback } from "@/components/admin/AdminFeedbackContext";

interface MessagesTableProps {
  initialMessages: AdminContactMessageRecord[];
}

const TOPIC_LABELS: Record<string, { label: string; badgeClass: string }> = {
  general: {
    label: "General Inquiry",
    badgeClass: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  },
  rides: {
    label: "Ride Invitation",
    badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  },
  sponsorship: {
    label: "Sponsorship",
    badgeClass: "border-gold-500/30 bg-gold-500/10 text-gold-400",
  },
  others: {
    label: "Other Matters",
    badgeClass: "border-purple-500/30 bg-purple-500/10 text-purple-300",
  },
  other: {
    label: "Other Matters",
    badgeClass: "border-purple-500/30 bg-purple-500/10 text-purple-300",
  },
  chapter: {
    label: "Chapter & Territory",
    badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  press: {
    label: "Press & Media",
    badgeClass: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  },
};

export function MessagesTable({ initialMessages }: MessagesTableProps) {
  const router = useRouter();
  const { showFeedback } = useAdminFeedback();
  const [messages, setMessages] = useState<AdminContactMessageRecord[]>(initialMessages);
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "archived">("unread");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<AdminContactMessageRecord | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  // If initialMessages updates via revalidation/prop change
  if (initialMessages !== messages && initialMessages.length !== messages.length) {
    setMessages(initialMessages);
  }

  const unreadCount = messages.filter((m) => m.status === "unread").length;
  const readCount = messages.filter((m) => m.status === "read").length;
  const archivedCount = messages.filter((m) => m.status === "archived").length;

  const filtered = messages.filter((m) => {
    if (filter !== "all" && m.status !== filter) return false;
    if (topicFilter !== "all" && m.topic !== topicFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchEmail = m.email.toLowerCase().includes(q);
      const matchTopic = (TOPIC_LABELS[m.topic]?.label || m.topic).toLowerCase().includes(q);
      const matchBody = m.message.toLowerCase().includes(q);
      return matchName || matchEmail || matchTopic || matchBody;
    }
    return true;
  });

  const handleUpdateStatus = (id: string, newStatus: "unread" | "read" | "archived") => {
    setFeedback(null);
    startTransition(async () => {
      const res = await updateContactMessageStatusAction(id, newStatus);
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        setFeedback({
          type: "success",
          text: `Inquiry marked as ${newStatus}.`,
        });
        router.refresh();
      } else {
        setFeedback({
          type: "error",
          text: res.error || "Failed to update inquiry status.",
        });
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Permanently delete this inquiry from "${name}"? This cannot be undone.`)) {
      return;
    }
    setFeedback(null);
    startTransition(async () => {
      const res = await deleteContactMessageAction(id);
      if (res.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
        setFeedback({
          type: "success",
          text: "Inquiry permanently deleted.",
        });
        showFeedback({
          type: "success",
          title: "Inquiry Deleted",
          message: `Inquiry from "${name}" has been permanently removed.`,
          scrollToTop: false,
        });
        router.refresh();
      } else {
        const err = res.error || "Failed to delete inquiry.";
        setFeedback({
          type: "error",
          text: err,
        });
        showFeedback({
          type: "error",
          title: "Delete Failed",
          message: err,
          scrollToTop: false,
        });
      }
    });
  };

  const openMessage = (m: AdminContactMessageRecord) => {
    setSelectedMessage(m);
    // If opening an unread message, automatically mark as read
    if (m.status === "unread") {
      handleUpdateStatus(m.id, "read");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`flex items-center justify-between rounded-sm border p-3 text-xs transition-all ${
            feedback.type === "success"
              ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
              : "border-red-500/40 bg-red-950/40 text-red-300"
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="cursor-pointer font-bold hover:opacity-80"
          >
            ✕
          </button>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-sm border border-charcoal-600 bg-obsidian-950 p-1">
          {(
            [
              { id: "unread", label: "Unread", count: unreadCount },
              { id: "all", label: "All Inquiries", count: messages.length },
              { id: "read", label: "Read", count: readCount },
              { id: "archived", label: "Archived", count: archivedCount },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`flex cursor-pointer items-center gap-1.5 rounded-xs px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                filter === tab.id
                  ? "border border-gold-500/40 bg-charcoal-700 text-gold-400"
                  : "text-graphite-400 hover:text-ivory-100"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-xs px-1.5 py-0.2 text-[0.6rem] font-bold ${
                  tab.id === "unread" && tab.count > 0
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-obsidian-900 text-graphite-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter by Topic and Search */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="cursor-pointer rounded-sm border border-charcoal-600 bg-obsidian-950 px-3 py-1.5 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
          >
            <option value="all">All Topics</option>
            <option value="general">General Inquiry</option>
            <option value="rides">Ride Invitations</option>
            <option value="sponsorship">Sponsorship</option>
            <option value="others">Other Matters</option>
          </select>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sender, email, words..."
              className="w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-1.5 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Messages List / Table */}
      <div className="overflow-hidden rounded-sm border border-charcoal-600 bg-obsidian-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-charcoal-700 bg-obsidian-950 text-[0.68rem] uppercase tracking-wider text-graphite-400">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Sender & Contact</th>
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">Message Preview</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-700/60 text-graphite-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-graphite-400 italic">
                    No contact inquiries found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((msg) => {
                  const topicMeta = TOPIC_LABELS[msg.topic] || {
                    label: msg.topic,
                    badgeClass: "border-charcoal-500 bg-charcoal-800 text-graphite-300",
                  };
                  const isUnread = msg.status === "unread";

                  return (
                    <tr
                      key={msg.id}
                      className={`cursor-pointer transition-colors ${
                        isUnread
                          ? "bg-gold-500/[0.04] hover:bg-gold-500/[0.08]"
                          : "hover:bg-obsidian-950/50"
                      }`}
                      onClick={() => openMessage(msg)}
                    >
                      {/* Status indicator */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {msg.status === "unread" && (
                          <span className="inline-flex items-center gap-1.5 rounded-xs border border-amber-500/40 bg-amber-950/40 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-amber-400">
                            <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Unread
                          </span>
                        )}
                        {msg.status === "read" && (
                          <span className="inline-flex items-center gap-1 rounded-xs border border-charcoal-600 bg-charcoal-800/80 px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-wider text-graphite-300">
                            ✓ Read
                          </span>
                        )}
                        {msg.status === "archived" && (
                          <span className="inline-flex items-center gap-1 rounded-xs border border-charcoal-700 bg-obsidian-950 px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-wider text-graphite-400">
                            ⌸ Archived
                          </span>
                        )}
                      </td>

                      {/* Sender */}
                      <td className="px-4 py-3.5">
                        <div className={`font-semibold ${isUnread ? "text-ivory-100" : "text-ivory-200"}`}>
                          {msg.name}
                        </div>
                        <a
                          href={`mailto:${msg.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[0.7rem] text-gold-400 hover:underline"
                        >
                          {msg.email}
                        </a>
                      </td>

                      {/* Topic */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-block rounded-xs border px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider ${topicMeta.badgeClass}`}
                        >
                          {topicMeta.label}
                        </span>
                      </td>

                      {/* Message preview */}
                      <td className="max-w-md px-4 py-3.5">
                        <p className={`line-clamp-2 text-xs leading-relaxed ${isUnread ? "font-medium text-ivory-200" : "text-graphite-300"}`}>
                          {msg.message}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-[0.7rem] text-graphite-400" suppressHydrationWarning>
                        {formatDeterministicDateTime(msg.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div
                          className="inline-flex items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => openMessage(msg)}
                            className="cursor-pointer rounded-xs border border-charcoal-600 bg-obsidian-950 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-gold-400 hover:border-gold-500 hover:bg-gold-500/10"
                          >
                            Read
                          </button>

                          {msg.status === "unread" ? (
                            <button
                              type="button"
                              disabled={isPending}
                              onClick={() => handleUpdateStatus(msg.id, "read")}
                              title="Mark as Read"
                              className="cursor-pointer rounded-xs border border-charcoal-600 bg-obsidian-950 px-2 py-1 text-[0.65rem] text-graphite-300 hover:border-charcoal-400 hover:text-ivory-100"
                            >
                              ✓
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={isPending}
                              onClick={() => handleUpdateStatus(msg.id, "unread")}
                              title="Mark as Unread"
                              className="cursor-pointer rounded-xs border border-charcoal-600 bg-obsidian-950 px-2 py-1 text-[0.65rem] text-graphite-400 hover:border-amber-500/50 hover:text-amber-400"
                            >
                              ●
                            </button>
                          )}

                          {msg.status !== "archived" ? (
                            <button
                              type="button"
                              disabled={isPending}
                              onClick={() => handleUpdateStatus(msg.id, "archived")}
                              title="Archive"
                              className="cursor-pointer rounded-xs border border-charcoal-600 bg-obsidian-950 px-2 py-1 text-[0.65rem] text-graphite-400 hover:border-charcoal-400 hover:text-ivory-100"
                            >
                              ⌸
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={isPending}
                              onClick={() => handleUpdateStatus(msg.id, "read")}
                              title="Restore to Active"
                              className="cursor-pointer rounded-xs border border-charcoal-600 bg-obsidian-950 px-2 py-1 text-[0.65rem] text-graphite-400 hover:border-charcoal-400 hover:text-ivory-100"
                            >
                              ↩
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleDelete(msg.id, msg.name)}
                            title="Delete"
                            className="cursor-pointer rounded-xs border border-red-500/30 bg-red-950/20 px-2 py-1 text-[0.65rem] text-red-400 hover:border-red-500 hover:bg-red-950/40"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Reader Modal / Drawer */}
      {selectedMessage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian-950/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="w-full max-w-2xl rounded-sm border border-charcoal-600 bg-obsidian-900 p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-charcoal-700 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-xl font-bold text-ivory-100">
                    {selectedMessage.name}
                  </h3>
                  <span
                    className={`rounded-xs border px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider ${
                      (TOPIC_LABELS[selectedMessage.topic] || {
                        badgeClass: "border-charcoal-500 bg-charcoal-800 text-graphite-300",
                      }).badgeClass
                    }`}
                  >
                    {(TOPIC_LABELS[selectedMessage.topic]?.label) || selectedMessage.topic}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-graphite-300">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-gold-400 hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                  <span>•</span>
                  <span suppressHydrationWarning>
                    {formatDeterministicDateTime(selectedMessage.created_at)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="cursor-pointer rounded-xs border border-charcoal-600 bg-obsidian-950 px-2.5 py-1 text-xs text-graphite-300 hover:border-charcoal-400 hover:text-ivory-100"
              >
                ✕ Close
              </button>
            </div>

            {/* Message Body */}
            <div className="my-6 max-h-[50vh] overflow-y-auto rounded-sm border border-charcoal-700/80 bg-obsidian-950 p-4 sm:p-5">
              <p className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-ivory-100">
                {selectedMessage.message}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-charcoal-700 pt-4">
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                    `Re: Inquiry from Spiritual Riders — ${
                      TOPIC_LABELS[selectedMessage.topic]?.label || selectedMessage.topic
                    }`
                  )}`}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-gold-500 bg-gold-500 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-obsidian-950 hover:bg-gold-400"
                >
                  ✉ Reply via Email
                </a>

                {selectedMessage.status === "unread" ? (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleUpdateStatus(selectedMessage.id, "read")}
                    className="cursor-pointer rounded-sm border border-charcoal-600 bg-charcoal-800 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-ivory-100 hover:border-charcoal-500"
                  >
                    Mark as Read
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleUpdateStatus(selectedMessage.id, "unread")}
                    className="cursor-pointer rounded-sm border border-charcoal-600 bg-charcoal-800 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-amber-400 hover:border-amber-500/50"
                  >
                    Mark as Unread
                  </button>
                )}

                {selectedMessage.status !== "archived" ? (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleUpdateStatus(selectedMessage.id, "archived")}
                    className="cursor-pointer rounded-sm border border-charcoal-600 bg-obsidian-950 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-graphite-300 hover:text-ivory-100"
                  >
                    Archive
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleUpdateStatus(selectedMessage.id, "read")}
                    className="cursor-pointer rounded-sm border border-charcoal-600 bg-obsidian-950 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-graphite-300 hover:text-ivory-100"
                  >
                    Unarchive
                  </button>
                )}
              </div>

              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDelete(selectedMessage.id, selectedMessage.name)}
                className="cursor-pointer rounded-sm border border-red-500/40 bg-red-950/20 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-red-400 hover:border-red-500 hover:bg-red-950/40"
              >
                Delete Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
