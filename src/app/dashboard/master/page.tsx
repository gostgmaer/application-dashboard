import { Suspense } from "react";

import Table from "@/components/pages/dashboard/users/permission/table";
import permissionServices from "@/lib/http/permissionServices";
import PrivateLayout from "@/components/layout/dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { MasterDataTable } from "@/components/pages/dashboard/master/tableClient";

export default async function Page(props: any) {

  return (
    <PrivateLayout>
      <div className=" py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <MasterDataTable />
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
