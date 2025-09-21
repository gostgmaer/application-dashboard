import { Suspense } from "react";
import UsersTable from "@/components/pages/dashboard/users/table";
import PrivateLayout from "@/components/layout/dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import userServices from "@/helper/services/userService";

export default async function UsersPage(props: any) {

  const query = await props.searchParams;
   const session = await getServerSession(authOptions);
  const user = await userServices.getAll(query, session?.accessToken);

  return (
   <PrivateLayout>
     <div className=" mx-auto py-2">
      <Suspense fallback={<div>Loading...</div>}>
        <UsersTable props={{ ...user.data }} />
      </Suspense>
    </div>
   </PrivateLayout>
  );
}
