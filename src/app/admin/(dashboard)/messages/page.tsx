import Link from "next/link";
import { getAdminContactMessages } from "@/lib/db/admin";
import { MessagesTable } from "@/components/admin/MessagesTable";

export default async function AdminMessagesPage() {
  const messages = await getAdminContactMessages().catch(() => []);

  const unreadCount = messages.filter((m) => m.status === "unread").length;
  const readCount = messages.filter((m) => m.status === "read").length;
  const archivedCount = messages.filter((m) => m.status === "archived").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal-700 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ivory-100 sm:text-3xl">
              Contact Inquiries
            </h1>
            {unreadCount > 0 ? (
              <span className="rounded-xs border border-amber-500/40 bg-amber-950/40 px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-amber-400">
                ● {unreadCount} Pending Attention
              </span>
            ) : (
              <span className="rounded-xs border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-0.5 text-[0.62rem] font-medium uppercase tracking-wider text-emerald-400">
                ✓ All Caught Up
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-graphite-300">
            Incoming dispatches submitted through the public contact desk. Review invitations, sponsorship proposals, and messages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm border border-gold-500 bg-gold-500/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-gold-400 transition-colors hover:bg-gold-500/20"
          >
            Open Contact Desk ↗
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-4">
          <span className="text-[0.68rem] uppercase tracking-wider text-graphite-400">
            Unread Inquiries
          </span>
          <div className="mt-1 font-display text-2xl font-bold text-amber-400">
            {unreadCount}
          </div>
        </div>

        <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-4">
          <span className="text-[0.68rem] uppercase tracking-wider text-graphite-400">
            Total Received
          </span>
          <div className="mt-1 font-display text-2xl font-bold text-ivory-100">
            {messages.length}
          </div>
        </div>

        <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-4">
          <span className="text-[0.68rem] uppercase tracking-wider text-graphite-400">
            Read & Handled
          </span>
          <div className="mt-1 font-display text-2xl font-bold text-emerald-400">
            {readCount}
          </div>
        </div>

        <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-4">
          <span className="text-[0.68rem] uppercase tracking-wider text-graphite-400">
            Archived
          </span>
          <div className="mt-1 font-display text-2xl font-bold text-graphite-400">
            {archivedCount}
          </div>
        </div>
      </div>

      {/* Messages Management Table */}
      <MessagesTable initialMessages={messages} />
    </div>
  );
}
