import { getServerSession } from "next-auth";

import Breadcrumbs from "@/components/layout/common/breadcrumb";

import { Suspense } from "react";
import userServices from "@/helper/services/userService";
import { authOptions } from "@/app/api/auth/authOptions";
import PrivateLayout from "@/components/layout/dashboard";
import AccountPage from "@/components/pages/dashboard/profile/account";
import authService from "@/helper/services/authServices";
import addressServices from "@/helper/services/addressService";
// Adjust path based on your project structure

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userData = await authService.getAccountSetting(session?.accessToken);
     const address = await addressServices.getUser(session?.accessToken);


  return (
    <PrivateLayout>
      <div className="mx-auto py-2 overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumbs heading="Account Settings" desc="Manage your account settings and preferences" btn={{ show: false }} />
          <div className="rounded-md   shadow-sm overflow-auto ">
          <AccountPage user={{...userData.data,address:address.data}}></AccountPage>
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
