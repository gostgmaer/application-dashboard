import { Suspense } from "react";
import PrivateLayout from "@/components/layout/dashboard";
import UserDashboard from "@/components/pages/dashboard/users/stats";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

export default async function UsersPage(props: any) {
  const session: any = await getServerSession(authOptions);

  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <UserDashboard token={session?.accessToken}></UserDashboard>
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
