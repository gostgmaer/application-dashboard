import { Suspense } from "react";
import PrivateLayout from "@/components/layout/dashboard";
import productService from "@/lib/http/ProductServices";
import DashboardPage from "@/components/pages/dashboard/product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import categoryServices from "@/lib/http/categoryService";
// import Table from "@/components/pages/dashboard/users/roles/table";

export default async function UsersPage(props: any) {
  const session: any = await getServerSession(authOptions);
  let category: any = await categoryServices.getActive(
    undefined,
    session?.accessToken
  );
  console.log(category);
  
  category = category?.data?.map((r: any) => ({
    label: r.title
      .split("_")
      .map((w: any) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    value: r._id,
  }));

  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <DashboardPage token={session.accessToken} category={category} />
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
