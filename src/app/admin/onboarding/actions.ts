"use server";

import { requireAdmin } from "@/lib/auth/server";
import {
  approveSubmission,
  getAdminSubmissionDetail,
  rejectSubmission,
} from "@/lib/db/onboarding";
import {
  notifyApplicantApproved,
  notifyBrotherhoodNewMember,
} from "@/lib/onesignal-server";
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

    // Fetch submission details before approval for notification context
    const { submission } = await getAdminSubmissionDetail(submissionId);

    const result = await approveSubmission(submissionId, adminEmail);

    revalidatePath("/admin/onboarding");
    revalidatePath(`/admin/onboarding/${submissionId}`);
    revalidatePath("/admin/riders");
    revalidatePath("/riders");
    revalidatePath("/");

    // Automated Push Notification Triggers:
    if (submission) {
      const isUpdate = Boolean(submission.rider_id);

      // 1. Notify the individual applicant directly on their device
      notifyApplicantApproved({
        id: submissionId,
        display_name: submission.display_name,
        slug: submission.slug,
        is_update: isUpdate,
      }).catch((err) =>
        console.warn("[OneSignal] Applicant approval push error:", err)
      );

      // 2. Announce new brotherhood member to subscribers (only for new profiles, not edits)
      if (!isUpdate) {
        notifyBrotherhoodNewMember({
          display_name: submission.display_name,
          full_name: submission.full_name,
          slug: submission.slug,
          motorcycle_name: `${submission.bike_brand} ${submission.bike_model}`.trim(),
          cover_image_url:
            submission.cover_image_url || submission.profile_image_url,
        }).catch((err) =>
          console.warn("[OneSignal] Brotherhood new member push error:", err)
        );
      }
    }

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
