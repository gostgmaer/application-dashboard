import Breadcrumbs from "@/components/layout/common/breadcrumb";
import PrivateLayout from "@/components/layout/dashboard";
import RolesPage from "@/components/pages/dashboard/users/roles";
import React, { Suspense } from "react";

const Page = async () => {

  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumbs
            heading={"Role Dashboard"}
            desc={"Manage user roles, permissions, and access control across your organization"}
            btn={{ show: false }}
          ></Breadcrumbs>

          <div className="rounded-md  shadow-sm overflow-auto ">
           <RolesPage></RolesPage>
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
};

export default Page;
