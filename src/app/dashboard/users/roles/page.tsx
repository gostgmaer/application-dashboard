import { Suspense } from "react";
import Table from "@/components/pages/dashboard/users/roles/table";
import roleServices from "@/helper/services/roleServices";
import PrivateLayout from "@/components/layout/dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import permissionServices from "@/helper/services/permissionServices";

export default async function Page(props: any) {
  const query = await props.searchParams;
  const session: any = await getServerSession(authOptions);
  const roles = await roleServices.getRoleStatistics(
    session?.accessToken,
    query
  );
  const p = await permissionServices.getPermissionsGrouped(
    query,
    session?.accessToken
  );

  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <Table props={{ ...roles.data, permissions: p.data }} />
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
