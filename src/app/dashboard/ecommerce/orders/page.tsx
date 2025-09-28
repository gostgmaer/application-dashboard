import { Suspense } from "react";
import Table from "@/components/pages/dashboard/order/table";
import PrivateLayout from "@/components/layout/dashboard";
import orderServices from "@/lib/http/OrderServices";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

export default async function UsersPage(props: any) {
  const query = await props.searchParams;
  const session = await getServerSession(authOptions);
  const data = await orderServices.getOrders(query, session?.accessToken);
  console.log(data);

  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <Table props={{ ...data }} />
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
