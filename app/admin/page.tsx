 export const dynamic = "force-dynamic";

 import { getAnalyticsData } from "@/lib/analytics-service";
 import { Suspense } from "react";
 import AdminDashboard from "./admin-dashboard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

 export default async function AdminPage() {
   const { has } = await auth();

   const canAccessAdmin = has({ permission: 'org:admin' }) ||
                          has({ role: 'admin' });

   if (!canAccessAdmin) {
     redirect("/"); // Redirect non-admins to home page
   }

   const analyticsData = await getAnalyticsData();

  return (
    <div className="min-h-screen w-full bg-base-100">
      <div className="container mx-auto py-12 px-4 sm:px-6 md:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-base-content">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-base-content/70">
            Analytics and insights for the platform
          </p>
        </header>

        <Suspense fallback={<div>Loading analytics...</div>}>
          <AdminDashboard analyticsData={analyticsData} />
        </Suspense>
      </div>
    </div>
  );
}