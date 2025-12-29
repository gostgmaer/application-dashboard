import { Suspense } from "react";
import PrivateLayout from "@/components/layout/dashboard";
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
