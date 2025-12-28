import { Suspense } from "react";
import PrivateLayout from "@/components/layout/dashboard";
import DashboardLayout from "@/components/pages/dashboard";

export default async function Page(props: any) {
  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <DashboardLayout />
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
