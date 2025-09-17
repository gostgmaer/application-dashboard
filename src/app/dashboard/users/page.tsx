import { Suspense } from "react";
import UserServices from "@/helper/services/userService";
import UsersTable from "@/components/pages/dashboard/users/table";
import PrivateLayout from "@/components/layout/dashboard";

export default async function UsersPage(props: any) {

  const query = await props.searchParams;
  const user = await UserServices.getAllUsers(query, {});

  return (
   <PrivateLayout>
     <div className=" mx-auto py-2">
      <Suspense fallback={<div>Loading...</div>}>
        <UsersTable props={{ ...user }} />
      </Suspense>
    </div>
   </PrivateLayout>
  );
}
