"use client";

import { loginAdmin } from "@/lib/auth/actions";
import Link from "next/link";
import { useActionState } from "react";

const initialState = {
  error: null as string | null,
  success: false,
};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-sm border border-charcoal-600 bg-obsidian-900/90 p-8 shadow-2xl backdrop-blur-md">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <p className="font-display text-2xl font-bold tracking-[0.22em] text-ivory-100">
            SPIRITUAL RIDERS
          </p>
          <div className="mt-2 inline-flex items-center gap-2">
            <span className="h-px w-6 bg-gold-500/60" />
            <span className="text-[0.65rem] font-medium tracking-[0.3em] text-gold-400 uppercase">
              Admin Portal
            </span>
            <span className="h-px w-6 bg-gold-500/60" />
          </div>
          <p className="mt-3 text-xs text-graphite-300">
            Authenticate to access the community management console.
          </p>
        </div>

        {/* Error Alert */}
        {state?.error && (
          <div
            role="alert"
            className="mb-6 rounded-sm border border-red-500/40 bg-red-950/30 p-3 text-xs text-red-300"
          >
            {state.error}
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-wider text-graphite-300"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@spiritualriders.in"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3.5 py-2.5 text-sm text-ivory-100 placeholder-graphite-400 transition-colors focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-wider text-graphite-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3.5 py-2.5 text-sm text-ivory-100 placeholder-graphite-400 transition-colors focus:border-gold-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-gold-500 bg-gold-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-obsidian-950 transition-[background-color,border-color,opacity] hover:border-gold-400 hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin text-obsidian-950"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-charcoal-700 pt-4 text-center">
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
