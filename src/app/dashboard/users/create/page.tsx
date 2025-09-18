import { authOptions } from "@/app/api/auth/authOptions";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import PrivateLayout from "@/components/layout/dashboard";
import UserCreate from "@/components/pages/dashboard/users/form";
import roleServices from "@/helper/services/roleServices";
import authService from "@/lib/services/auth";
import { getServerSession } from "next-auth";
import React, { Suspense } from "react";

const Page = async () => {
  const session = await getServerSession(authOptions);
  const role = await roleServices.getAll({},session?.accessToken);

  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumbs
            heading={"Create New User"}
            btn={{ show: false }}
          ></Breadcrumbs>

          <div className="rounded-md  shadow-sm overflow-auto ">
            <UserCreate master={{roles:role["results"]}}></UserCreate>
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
};

export default Page;
