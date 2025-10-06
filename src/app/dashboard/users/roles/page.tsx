import { authOptions } from "@/app/api/auth/authOptions";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import PrivateLayout from "@/components/layout/dashboard";
import RolesPage from "@/components/pages/dashboard/users/roles";
import permissionServices from "@/lib/http/permissionServices";
import roleServices from "@/lib/http/roleServices";
import { getServerSession } from "next-auth";
import React, { Suspense } from "react";

const Page = async (props: any) => {
  const query = await props.searchParams;
  const session: any = await getServerSession(authOptions);

  const stats = await roleServices.getCompleteRoleStatistics(
    session?.accessToken
  );

  const p = await permissionServices.getPermissionsGrouped(
    query,
    session?.accessToken
  );
  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
         

          <div className="rounded-md  shadow-sm overflow-auto ">
            <RolesPage
              props={{
                permissions: p.data,
                stats: stats.data,
                token: session.accessToken,
              }}
            ></RolesPage>
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
};

export default Page;
