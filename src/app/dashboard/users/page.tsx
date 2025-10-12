import { Suspense } from "react";
import PrivateLayout from "@/components/layout/dashboard";
import UserDashboard from "@/components/pages/dashboard/users/stats";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import roleServices from "@/lib/http/roleServices";

export default async function UsersPage(props: any) {
  const session: any = await getServerSession(authOptions);
  let roles = await roleServices.getActive(undefined, session?.accessToken);
  roles = roles?.data?.map((r: any) => ({
    label: r.name
      .split("_")
      .map((w:any) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    value: r._id,
  }));




  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <UserDashboard
            token={session?.accessToken}
            props={roles}
          ></UserDashboard>
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
