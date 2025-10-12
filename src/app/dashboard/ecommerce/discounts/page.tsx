import { authOptions } from "@/app/api/auth/authOptions";
import PrivateLayout from "@/components/layout/dashboard";
import DiscountsPage from "@/components/pages/dashboard/product/discounts";
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
            <DiscountsPage></DiscountsPage>
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
};

export default Page;
