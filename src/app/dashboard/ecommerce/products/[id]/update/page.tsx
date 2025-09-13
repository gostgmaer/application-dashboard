import Breadcrumbs from "@/components/layout/common/breadcrumb";
import ProductCreate from "@/components/pages/dashboard/product/form";
import ProductServices from "@/helper/services/ProductServices";
import React, { Suspense } from "react";

const Page = async(url:any) => {

  const params = await url.params
  const data = await ProductServices.getProductByIdOrSlug(params.id,{})

  console.log(data);
  
  
  return (
    <div className=" mx-auto py-2">
      <Suspense fallback={<div>Loading...</div>}>
        <Breadcrumbs heading="Update Product" btn={{ show: false }}></Breadcrumbs>

        <div className="rounded-md  bg-gray-50  shadow-sm overflow-auto ">
          <ProductCreate data={data}></ProductCreate>
        </div>
      </Suspense>
    </div>
  );
};

export default Page;
