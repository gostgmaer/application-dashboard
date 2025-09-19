import Breadcrumbs from "@/components/layout/common/breadcrumb";
import PrivateLayout from "@/components/layout/dashboard";
import ProductCreate from "@/components/pages/dashboard/product/form";
import React, { Suspense } from "react";

const Page = () => {  
  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumbs heading={'Create New Product'} btn={{ show: false }}></Breadcrumbs>

          <div className="rounded-md   shadow-sm overflow-auto ">
            <ProductCreate></ProductCreate>
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
};

export default Page;
