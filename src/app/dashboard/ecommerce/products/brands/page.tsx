import { Suspense } from "react";
import BrandServices from "@/helper/services/BrandService";
import Table from "@/components/pages/dashboard/product/brand/table";
export default async function UsersPage(props: any) {

   const query = await props.searchParams;
  // const {sortBy,sortDesc} = query
  const brands = await BrandServices.getBrands(query, {});
// console.log(product);

  return (
     <div className=" mx-auto">
         <Suspense fallback={<div>Loading...</div>}>
           <Table props={{ ...brands }} />
         </Suspense>
       </div>
  );
}

