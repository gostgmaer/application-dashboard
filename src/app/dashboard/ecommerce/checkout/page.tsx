import Breadcrumbs from "@/components/layout/common/breadcrumb";
import { Suspense } from "react";
import PrivateLayout from "@/components/layout/dashboard";
import CheckoutPage from "@/components/pages/dashboard/product/checkout";
// Adjust path based on your project structure

export default async function Page() {


  return (
    <PrivateLayout>
      <div className="mx-auto py-2 overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumbs
            heading="Product Checkout"
            desc="Review your items and complete your purchase"
            btn={{ show: false }}
          />
          <div className="rounded-md   shadow-sm overflow-auto ">
            <CheckoutPage></CheckoutPage>
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
