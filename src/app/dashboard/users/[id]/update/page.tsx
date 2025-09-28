import { authOptions } from "@/app/api/auth/authOptions";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import PrivateLayout from "@/components/layout/dashboard";
import UserCreate from "@/components/pages/dashboard/users/form";
import roleServices from "@/lib/http/roleServices";
import userServices from "@/lib/http/userService";
import { getServerSession } from "next-auth";
import React, { Suspense } from "react";

const Page = async (url: any) => {
  const session = await getServerSession(authOptions);
  const { id } = await url.params;
  const data = await userServices.getSingle(id, session?.accessToken);
  const roles = await roleServices.getAll({}, session?.accessToken);

  console.log(roles);

  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumbs
            heading={"Update User"}
            btn={{ show: false }}
          ></Breadcrumbs>

          <div className="rounded-md  shadow-sm overflow-auto ">
            <UserCreate
              data={data.data}
              id={id}
              master={{ roles: roles.data }}
            ></UserCreate>
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
};

export default Page;
