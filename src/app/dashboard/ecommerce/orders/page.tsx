import { Suspense } from "react";

import OrderServices from "@/helper/services/OrderServices";
import Table from "@/components/pages/dashboard/order/table";

export default async function UsersPage(props: any) {

   const query = await props.searchParams;
  const data = await OrderServices.getOrders(query, {});

  return (
    <div className="container mx-auto py-2">
      <Suspense fallback={<div>Loading...</div>}>
        <Table props={{ ...data }} />
      </Suspense>
    </div>
  );
}
