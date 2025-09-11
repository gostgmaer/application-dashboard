import Breadcrumbs from "@/components/layout/common/breadcrumb";
import UserCreate from "@/components/pages/dashboard/users/form";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div className="container mx-auto py-2">
      <Suspense fallback={<div>Loading...</div>}>
        <Breadcrumbs heading={"Create New User"} btn={{ show: false }}></Breadcrumbs>

        <div className="rounded-md  shadow-sm overflow-auto ">
          <UserCreate></UserCreate>
        </div>
      </Suspense>
    </div>
  );
};

export default Page;
