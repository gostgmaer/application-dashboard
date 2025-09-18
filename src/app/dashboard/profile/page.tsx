import { getServerSession } from "next-auth";

import Breadcrumbs from "@/components/layout/common/breadcrumb";
import Profile from "@/components/pages/dashboard/profile";
import { Suspense } from "react";
import userServices from "@/helper/services/userService";
import { authOptions } from "@/app/api/auth/authOptions";
import PrivateLayout from "@/components/layout/dashboard";
// Adjust path based on your project structure

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const userData = await userServices.getProfile(session?.accessToken);

  return (
    <PrivateLayout>
      <div className="mx-auto py-2 overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumbs heading="My Profile" btn={{ show: false }} />
          <div className="rounded-md   shadow-sm overflow-auto ">
            <Profile userData={userData.data} />
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
