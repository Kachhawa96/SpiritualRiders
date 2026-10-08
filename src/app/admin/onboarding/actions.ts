"use server";

import { requireAdmin } from "@/lib/auth/server";
import {
  approveSubmission,
  rejectSubmission,
} from "@/lib/db/onboarding";
import { revalidatePath } from "next/cache";

export interface AdminReviewActionResult {
  success: boolean;
  error?: string;
  riderId?: string;
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  return fallback;
}

/**
 * Admin action: Approve a pending submission.
 * Immediately creates or updates the live rider in public.riders.
 */
export async function approveSubmissionAction(
  submissionId: string
): Promise<AdminReviewActionResult> {
  try {
    const adminUser = await requireAdmin();
    const adminEmail = adminUser.email || "admin@spiritualriders.in";

    const result = await approveSubmission(submissionId, adminEmail);

    revalidatePath("/admin/onboarding");
    revalidatePath(`/admin/onboarding/${submissionId}`);
    revalidatePath("/admin/riders");
    revalidatePath("/riders");
    revalidatePath("/");

    return {
      success: true,
      riderId: result.riderId,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to approve submission."),
    };
  }
}

/**
 * Admin action: Reject a pending submission with optional feedback.
 */
export async function rejectSubmissionAction(
  submissionId: string,
  notes?: string
): Promise<AdminReviewActionResult> {
  try {
    const adminUser = await requireAdmin();
    const adminEmail = adminUser.email || "admin@spiritualriders.in";

    await rejectSubmission(submissionId, adminEmail, notes);

    revalidatePath("/admin/onboarding");
    revalidatePath(`/admin/onboarding/${submissionId}`);

    return {
      success: true,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to reject submission."),
    };
  }
}
