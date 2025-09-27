import { Suspense } from "react";
import PrivateLayout from "@/components/layout/dashboard";

export default async function UsersPage(props: any) {

  return (
   <PrivateLayout>
     <div className=" mx-auto py-2">
      <Suspense fallback={<div>Loading...</div>}>
       
      </Suspense>
    </div>
   </PrivateLayout>
  );
}
