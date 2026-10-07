"use server";

import { createAuthServerClient } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface LoginActionState {
  error: string | null;
  success: boolean;
}

export async function loginAdmin(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null)?.trim() ?? "";

  if (!email || !password) {
    return { error: "Email and password are required.", success: false };
  }

  const supabase = await createAuthServerClient();
  if (!supabase) {
    return {
      error: "Supabase connection is not configured. Please check environment variables.",
      success: false,
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      error: error?.message ?? "Invalid email or password.",
      success: false,
    };
  }

  // Check admin email whitelist if configured
  const adminEmailsEnv = process.env.ADMIN_EMAILS;
  if (adminEmailsEnv && adminEmailsEnv.trim() !== "") {
    const allowed = adminEmailsEnv
      .split(",")
      .map((e) => e.toLowerCase().trim())
      .filter(Boolean);

    if (!allowed.includes(data.user.email?.toLowerCase().trim() ?? "")) {
      await supabase.auth.signOut();
      return {
        error: "Access Denied: This account is not an authorized administrator.",
        success: false,
      };
    }
  }

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  const supabase = await createAuthServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  revalidatePath("/admin", "layout");
  redirect("/admin/login");
}
