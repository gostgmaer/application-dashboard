import Breadcrumbs from "@/components/layout/common/breadcrumb";
import PrivateLayout from "@/components/layout/dashboard";
import ProductCreate from "@/components/pages/dashboard/product/form";
import productService from "@/lib/http/ProductServices";
import React, { Suspense } from "react";

const Page = async (url: any) => {
  const params = await url.params;
  const data = await productService.get(params.id);
  console.log(data);
  
  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumbs
            heading="Update Product"
            btn={{ show: false }}
          ></Breadcrumbs>

          <div className="rounded-md   shadow-sm overflow-auto ">
            <ProductCreate data={data.data}></ProductCreate>
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
};

export default Page;
