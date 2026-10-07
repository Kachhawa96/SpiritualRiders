/**
 * Server-side Supabase Auth and Admin Authorization.
 * Never exposes service-role keys or admin secrets to the client.
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface AdminAuthResult {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  reason?: string;
}

/**
 * Creates a Supabase client that reads and sets session cookies via Next.js headers.
 */
export async function createAuthServerClient(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Can happen in Server Components before streaming, safe to ignore
          // when handled by Server Actions or middleware.
        }
      },
    },
  });
}

/**
 * Resolves current authenticated user from session cookies.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createAuthServerClient();
  if (!supabase) return null;

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Verifies if the authenticated user is an authorized admin.
 * Checks ADMIN_EMAILS environment variable and user metadata roles.
 */
export async function verifyAdminAccess(): Promise<AdminAuthResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      reason: "No active session.",
    };
  }

  const adminEmailsEnv = process.env.ADMIN_EMAILS;
  const userEmail = (user.email ?? "").toLowerCase().trim();

  // If ADMIN_EMAILS is configured, enforce strict whitelist
  if (adminEmailsEnv && adminEmailsEnv.trim() !== "") {
    const allowedEmails = adminEmailsEnv
      .split(",")
      .map((e) => e.toLowerCase().trim())
      .filter(Boolean);

    const isWhitelisted = allowedEmails.includes(userEmail);
    if (!isWhitelisted) {
      return {
        isAuthenticated: true,
        isAdmin: false,
        user,
        reason: `Email ${user.email} is not in the administrator whitelist.`,
      };
    }
  }

  // Check app_metadata or user_metadata for explicit non-admin role
  const role = user.app_metadata?.role || user.user_metadata?.role;
  if (role && role !== "admin" && role !== "authenticated") {
    return {
      isAuthenticated: true,
      isAdmin: false,
      user,
      reason: `User role is '${role}', required 'admin'.`,
    };
  }

  return {
    isAuthenticated: true,
    isAdmin: true,
    user,
  };
}

/**
 * Guard for server components and server actions.
 * Redirects to /admin/login if unauthenticated, or /admin/access-denied if unauthorized.
 */
export async function requireAdmin(): Promise<User> {
  const access = await verifyAdminAccess();

  if (!access.isAuthenticated || !access.user) {
    redirect("/admin/login");
  }

  if (!access.isAdmin) {
    redirect("/admin/access-denied");
  }

  return access.user;
}

/**
 * Returns a database client suitable for admin operations.
 * If SUPABASE_SERVICE_ROLE_KEY is present in the server environment, uses it.
 * Otherwise uses the authenticated server client with the user's session JWT.
 */
export async function getAdminDbClient(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceRoleKey && serviceRoleKey.trim() !== "") {
    return createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return createAuthServerClient();
}
