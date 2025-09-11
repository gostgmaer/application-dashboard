import { Suspense } from "react";
import UserServices from "@/helper/services/userService";
// import Table from "@/components/pages/dashboard/product/table";
import ProductServices from "@/helper/services/ProductServices";
import { transformSortParams } from "@/helper/function";
import Table from "@/components/pages/dashboard/product/categories/table";
import CategoryServices from "@/helper/services/CategoryServices";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
// import Table from "@/components/pages/dashboard/users/roles/table";

export default async function UsersPage(props: any) {
  const query = await props.searchParams;
  // const {sortBy,sortDesc} = query
  const categories = await CategoryServices.getCategories(query, {});
  // console.log(product);

  return (
    <div className=" mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <Table props={{ ...categories }} />
      </Suspense>
    </div>
  );
}
