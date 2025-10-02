import { Suspense } from "react";
import PrivateLayout from "@/components/layout/dashboard";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import OrderPage from "@/components/pages/dashboard/order";

export default async function UsersPage(props: any) {


  return (
      <PrivateLayout>
         <div className=" mx-auto py-2">
           <Suspense fallback={<div>Loading...</div>}>
             <Breadcrumbs heading={'Order Dashboard'} btn={{ show: false }}></Breadcrumbs>
   
             <div className="rounded-md   shadow-sm overflow-auto ">
               <OrderPage></OrderPage>
             </div>
           </Suspense>
         </div>
       </PrivateLayout>
  );
}
