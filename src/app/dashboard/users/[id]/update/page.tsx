import Breadcrumbs from "@/components/layout/common/breadcrumb";
import UserCreate from "@/components/pages/dashboard/users/form";
import UserServices from "@/helper/services/userService";
import React, { Suspense } from "react";

const Page =async (url:any) => {


    const data = await UserServices.getUserById(url.params.id,{})
console.log(data);

  
  return (
    <div className="container mx-auto py-2">
      <Suspense fallback={<div>Loading...</div>}>
        <Breadcrumbs heading={"Update User"} btn={{ show: false }}></Breadcrumbs>

        <div className="rounded-md  shadow-sm overflow-auto ">
          <UserCreate data={data.result} id={data.result._id} ></UserCreate>
        </div>
      </Suspense>
    </div>
  );
};

export default Page;
