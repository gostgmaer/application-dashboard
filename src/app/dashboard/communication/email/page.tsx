import { authOptions } from "@/app/api/auth/authOptions";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import PrivateLayout from "@/components/layout/dashboard";
import { EmailClient } from "@/components/pages/dashboard/email/EmailClient";
import UserCreate from "@/components/pages/dashboard/users/form";
import roleServices from "@/lib/http/roleServices";
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
            heading={"Mail Box"}
            btn={{ show: false }}
          ></Breadcrumbs>

          <div className="rounded-md  shadow-sm overflow-auto ">
            <EmailClient></EmailClient>
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
};

export default Page;
