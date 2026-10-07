import { requireAdmin } from "@/lib/auth/server";
import { AdminNav } from "@/components/admin/AdminNav";
import type { ReactNode } from "react";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNav userEmail={user.email ?? "Admin"} />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
