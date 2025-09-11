import Breadcrumbs from "@/components/layout/common/breadcrumb";
import ProductCreate from "@/components/pages/dashboard/product/form";
import ProductServices from "@/helper/services/ProductServices";
import React, { Suspense } from "react";

const Page = async(url:any) => {

  const data = await ProductServices.getSingleProducts(url.params.id,{})

  
  
  return (
    <div className="container mx-auto py-2">
      <Suspense fallback={<div>Loading...</div>}>
        <Breadcrumbs heading="Update Product" btn={{ show: false }}></Breadcrumbs>

        <div className="rounded-md  bg-gray-50  shadow-sm overflow-auto ">
          <ProductCreate data={data.results}></ProductCreate>
        </div>
      </Suspense>
    </div>
  );
};

export default Page;
