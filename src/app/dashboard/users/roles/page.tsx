import { Suspense } from "react";
import UserServices from "@/helper/services/userService";
import Table from "@/components/pages/dashboard/users/roles/table";
import roleServices from "@/helper/services/roleServices";

export default async function Page(props: any) {
  console.log(await props.searchParams);
  const query = await props.searchParams;

  const data = await roleServices.getAll(query, {});

  return (
    <div className="container mx-auto py-2">
      <Suspense fallback={<div>Loading...</div>}>
        <Table props={{ ...data }} />
      </Suspense>
    </div>
  );
}
