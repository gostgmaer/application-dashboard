import { Suspense } from "react";
import UserServices from "@/helper/services/userService";
// import Table from "@/components/pages/dashboard/product/table";
import ProductServices from "@/helper/services/ProductServices";
import { transformSortParams } from "@/helper/function";
import Table from "@/components/pages/dashboard/product/categories/table";
import CategoryServices from "@/helper/services/CategoryServices";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import PrivateLayout from "@/components/layout/dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import categoryServices from "@/helper/services/categoryService";
// import Table from "@/components/pages/dashboard/users/roles/table";

export default async function UsersPage(props: any) {
  const query = await props.searchParams;
  // const {sortBy,sortDesc} = query
   const session = await getServerSession(authOptions);
  const categories = await categoryServices.getAll(query,session?.accessToken);

  return (
     <PrivateLayout>
         <div className=" mx-auto py-2">
           <Suspense fallback={<div>Loading...</div>}>
             <Table props={categories.data} />
           </Suspense>
         </div>
       </PrivateLayout>
  );
}
