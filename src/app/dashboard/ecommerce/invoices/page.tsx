import { Suspense } from "react";

import PrivateLayout from "@/components/layout/dashboard";

import InvoiceDashboard from "@/components/pages/dashboard/order/invoice/table";

export default async function UsersPage(props: any) {


  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <InvoiceDashboard />
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
