 export const dynamic = "force-dynamic";

 import { getAnalyticsData } from "@/lib/analytics-service";
 import { Suspense } from "react";
 import AdminDashboard from "./admin-dashboard";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

 export default async function AdminPage() {
   const user = await currentUser();

   if (!user) {
     redirect("/sign-in");
   }

   // Check if user is admin using Clerk organizations
   const clerk = await clerkClient();
   const memberships = await clerk.users.getOrganizationMembershipList({ userId: user.id });

   // Check if user is admin in any organization
   const isAdmin = memberships.data?.some(
     membership => membership.role === 'admin' ||
                   membership.permissions?.includes('org:admin') ||
                   membership.permissions?.includes('org:sys_admin')
   ) || false;

   if (!isAdmin) {
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