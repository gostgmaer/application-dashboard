import { authOptions } from "@/app/api/auth/authOptions";
import PrivateLayout from "@/components/layout/dashboard";
import DiscountsPage from "@/components/pages/dashboard/product/discounts";
import permissionServices from "@/lib/http/permissionServices";
import productService from "@/lib/http/ProductServices";
import roleServices from "@/lib/http/roleServices";
import { getServerSession } from "next-auth";
import React, { Suspense } from "react";

const Page = async (props: any) => {
  const query = await props.searchParams;
  const session: any = await getServerSession(authOptions);

  const statics = await productService.getActiveDealStatics(
    session?.accessToken
  );

  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <div className="rounded-md  shadow-sm overflow-auto ">
            <DiscountsPage statics={{...statics.data}} ></DiscountsPage>
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
};

export default Page;
