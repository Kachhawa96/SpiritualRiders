import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminSubmissionDetail } from "@/lib/db/onboarding";
import { SubmissionReview } from "@/components/admin/SubmissionReview";

interface SubmissionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmissionDetailPage({
  params,
}: SubmissionDetailPageProps) {
  const { id } = await params;
  const { submission, liveRider } = await getAdminSubmissionDetail(id);

  if (!submission) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/onboarding"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-graphite-400 hover:text-gold-400"
        >
          ← Back to All Submissions
        </Link>
      </div>

      <SubmissionReview submission={submission} liveRider={liveRider} />
    </div>
  );
}
