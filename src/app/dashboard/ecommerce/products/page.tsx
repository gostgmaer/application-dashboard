import { Suspense } from "react";
import UserServices from "@/helper/services/userService";
import Table from "@/components/pages/dashboard/product/table";
import ProductServices from "@/helper/services/ProductServices";
import { transformSortParams } from "@/helper/function";
// import Table from "@/components/pages/dashboard/users/roles/table";

export default async function UsersPage(props: any) {

   const query = await props.searchParams;
  // const {sortBy,sortDesc} = query
  const product = await ProductServices.getAllProducts(query, {},{});
console.log(product);

  return (
    <div className="container mx-auto py-2">
      <Suspense fallback={<div>Loading...</div>}>
        <Table props={{ ...product }} />
      </Suspense>
    </div>
  );
}
