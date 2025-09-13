import Breadcrumbs from "@/components/layout/common/breadcrumb";
import ProductCreate from "@/components/pages/dashboard/product/nf";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div className=" mx-auto py-2">
      <Suspense fallback={<div>Loading...</div>}>
        <Breadcrumbs btn={{ show: false }}></Breadcrumbs>

        <div className="rounded-md   shadow-sm overflow-auto ">
          <ProductCreate></ProductCreate>
        </div>
      </Suspense>
    </div>
  );
};

export default Page;
