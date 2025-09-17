import { Suspense } from "react";
import Table from "@/components/pages/dashboard/users/roles/table";
import roleServices from "@/helper/services/roleServices";
import PrivateLayout from "@/components/layout/dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { headersToken } from "@/lib/utils/utils";
import permissionServices from "@/helper/services/permissonServie";

export default async function Page(props: any) {
  const query = await props.searchParams;
  const session = await getServerSession(authOptions);
  const res = await roleServices.getStatistics(query, session?.accessToken);
  const p = await permissionServices.getGropedPermissions(session?.accessToken);
  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <Table props={{ ...res.data, permissions: p.data.permissions }} />
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
