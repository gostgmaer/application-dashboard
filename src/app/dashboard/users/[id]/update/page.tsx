import { authOptions } from "@/app/api/auth/authOptions";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import PrivateLayout from "@/components/layout/dashboard";
import UserCreate from "@/components/pages/dashboard/users/form";
import roleServices from "@/helper/services/roleServices";
import UserServices from "@/helper/services/userService";
import { getServerSession } from "next-auth";
import React, { Suspense } from "react";

const Page = async (url: any) => {
  const session = await getServerSession(authOptions);
  const { id } = await url.params;
  const data = await UserServices.getSingleUser(id, session?.accessToken);
  const role = await roleServices.getAll({}, session?.accessToken);

  console.log(data);

  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumbs
            heading={"Create New User"}
            btn={{ show: false }}
          ></Breadcrumbs>

          <div className="rounded-md  shadow-sm overflow-auto ">
            <UserCreate
              data={data.data}
              id={data.data._id}
              master={{ roles: role["results"] }}
            ></UserCreate>
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
};

export default Page;
