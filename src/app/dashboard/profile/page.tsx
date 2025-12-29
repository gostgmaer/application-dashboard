import { getServerSession } from "next-auth";
import Breadcrumbs from "@/components/layout/common/breadcrumb";
import Profile from "@/components/pages/dashboard/profile";
import { Suspense } from "react";
import userServices from "@/lib/http/userService";
import { authOptions } from "@/app/api/auth/authOptions";
import PrivateLayout from "@/components/layout/dashboard";
import addressServices from "@/lib/http/address";
// Adjust path based on your project structure

export default async function Page() {
  const session = await getServerSession(authOptions);

  const userData = await userServices.getProfile(session?.accessToken);
  const address = await addressServices.getUserAddress(session?.accessToken);
  return (
    <PrivateLayout>
      <div className="mx-auto py-2 overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumbs heading="My Profile" btn={{ show: false }} />
          <div className="rounded-md   shadow-sm overflow-auto ">
            <Profile userData={userData.data} address={address.data} />
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
