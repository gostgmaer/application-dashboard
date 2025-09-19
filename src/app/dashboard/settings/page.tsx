import { authOptions } from "@/app/api/auth/authOptions";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import PrivateLayout from "@/components/layout/dashboard";
import roleServices from "@/helper/services/roleServices";
import { getServerSession } from "next-auth";
import React, { Suspense } from "react";


const Page = async () => {

  const session = await getServerSession(authOptions);
  const setting = await roleServices.getAll({}, session?.accessToken);

  return (
    <PrivateLayout>
      <div className="mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumbs heading={"Settings"} btn={{ show: false }} />
          <div className="rounded-md shadow-sm overflow-auto">
            {/* <SettingsPage settings={{}} /> */}
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
};

export default Page;

