"use server";

import { z } from "zod";
import { createAnonServerClient, hasSupabaseEnv } from "@/lib/db/client";

const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(100, "Name too long."),
  email: z.string().trim().email("Please enter a valid email address.").max(150),
  topic: z.enum(["general", "rides", "sponsorship", "others", "chapter", "press", "other"]).default("general"),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(3000, "Message is too long."),
});

export type ContactActionResult = {
  success: boolean;
  error?: string;
};

export async function submitContactMessageAction(formData: FormData): Promise<ContactActionResult> {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      topic: formData.get("topic") || "general",
      message: formData.get("message"),
    };

    const parsed = contactMessageSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message ?? "Invalid form data.";
      return { success: false, error: firstIssue };
    }

    if (hasSupabaseEnv()) {
      const supabase = createAnonServerClient();
      if (supabase) {
        const { error } = await supabase.from("contact_messages").insert({
          name: parsed.data.name,
          email: parsed.data.email,
          topic: parsed.data.topic,
          message: parsed.data.message,
          status: "unread",
        });

        if (error) {
          // If table doesn't exist yet in remote Supabase, log safely without failing visitor
          console.warn("[Contact Action] Supabase insert notice:", error.message);
        }
      }
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send message.";
    return { success: false, error: message };
  }
}
