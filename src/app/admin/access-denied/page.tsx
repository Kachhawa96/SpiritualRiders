import { getCurrentUser } from "@/lib/auth/server";
import { logoutAdmin } from "@/lib/auth/actions";
import Link from "next/link";

export default async function AccessDeniedPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-sm border border-red-500/30 bg-obsidian-900/90 p-8 text-center shadow-2xl backdrop-blur-md">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-red-500/40 bg-red-950/40 text-red-400">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </div>

        <h1 className="font-display text-2xl font-bold tracking-[0.1em] text-ivory-100">
          Access Denied
        </h1>

        <p className="mt-3 text-xs leading-relaxed text-graphite-300">
          Your account is authenticated, but does not possess administrator privileges
          for the Spiritual Riders portal.
        </p>

        {user?.email && (
          <div className="mt-4 rounded-sm border border-charcoal-600 bg-obsidian-950 p-2.5 text-xs text-graphite-200">
            Account: <span className="font-medium text-ivory-100">{user.email}</span>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="w-full cursor-pointer rounded-sm border border-charcoal-500 bg-charcoal-700/50 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-ivory-100 transition-colors hover:bg-charcoal-600"
            >
              Sign Out & Switch Account
            </button>
          </form>

          <Link
            href="/"
            className="text-xs text-graphite-400 transition-colors hover:text-gold-400"
          >
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
