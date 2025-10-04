import { Suspense } from "react";
import PrivateLayout from "@/components/layout/dashboard";
import productService from "@/lib/http/ProductServices";
import DashboardPage from "@/components/pages/dashboard/product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
// import Table from "@/components/pages/dashboard/users/roles/table";

export default async function UsersPage(props: any) {

  const session: any = await getServerSession(authOptions);

  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <DashboardPage token={session.accessToken} />
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
