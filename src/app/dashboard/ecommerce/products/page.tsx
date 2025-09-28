import { Suspense } from "react";
import Table from "@/components/pages/dashboard/product/table";
import PrivateLayout from "@/components/layout/dashboard";
import productService from "@/lib/http/ProductServices";
// import Table from "@/components/pages/dashboard/users/roles/table";

export default async function UsersPage(props: any) {
  const query = await props.searchParams;
  // const {sortBy,sortDesc} = query
  const product = await productService.list(query);

  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <Table props={{ ...product.data }} />
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
