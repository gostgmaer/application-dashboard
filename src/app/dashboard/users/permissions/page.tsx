import { Suspense } from "react";

import Table from "@/components/pages/dashboard/users/permission/table";
import permissionServices from "@/helper/services/permissonServie";

export default async function Page(props: any) {

  const query = await props.searchParams;
  const data = await permissionServices.getPermissions(query, {});

  return (
    <div className="container mx-auto py-2">
      <Suspense fallback={<div>Loading...</div>}>
        <Table props={{ ...data }} />
      </Suspense>
    </div>
  );
}
