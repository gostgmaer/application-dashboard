import { Suspense } from "react";
import UserServices from "@/helper/services/userService";
import Table from "@/components/pages/dashboard/users/roles/table";

export default async function UsersPage(props: any) {
  console.log(await props.searchParams);
  const query = await props.searchParams;

  const user = await UserServices.getUsers(query, {});

  return (
    <div className="container mx-auto py-2">
      <Suspense fallback={<div>Loading...</div>}>
        <Table props={{ ...user }} />
      </Suspense>
    </div>
  );
}
