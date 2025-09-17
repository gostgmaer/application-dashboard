import { Suspense } from "react";

import Table from "@/components/pages/dashboard/users/permission/table";
import permissionServices from "@/helper/services/permissonServie";
import PrivateLayout from "@/components/layout/dashboard";
import { headersToken } from "@/lib/utils/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

export default async function Page(props: any) {
  const query = await props.searchParams;
    const session = await getServerSession(authOptions);
  const data = await permissionServices.getPermissions(query,session?.accessToken,{});

  return (
    <PrivateLayout>
      {" "}
      <div className="container mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <Table props={{ ...data }} />
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
