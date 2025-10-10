import Breadcrumbs from "@/components/layout/common/breadcrumb";
import { Suspense } from "react";
import PrivateLayout from "@/components/layout/dashboard";
import { SettingsDashboard } from "@/components/pages/dashboard/profile/settings/settings-dashboard";
// Adjust path based on your project structure

export default async function Page() {

  return (
    <PrivateLayout>
      <div className="mx-auto py-2 overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumbs
            heading="Account Settings"
            desc="Manage your account settings and preferences"
            btn={{ show: false }}
          />
          <div className="rounded-md   shadow-sm overflow-auto ">
         

            <SettingsDashboard />;
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
