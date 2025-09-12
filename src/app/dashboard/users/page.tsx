import { Suspense } from "react";
import UserServices from "@/helper/services/userService";
import Table from "@/components/pages/dashboard/users/roles/table";
import UsersTable from "@/components/pages/dashboard/users/table";

export default async function UsersPage(props: any) {
  console.log(await props.searchParams);
  const query = await props.searchParams;

  const user = await UserServices.getAllUsers(query, {});

  return (
    <div className="container mx-auto py-2">
      <Suspense fallback={<div>Loading...</div>}>
        <UsersTable props={{ ...user }} />
      </Suspense>
    </div>
  );
}
