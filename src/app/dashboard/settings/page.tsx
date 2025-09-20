import Breadcrumbs from "@/components/layout/common/breadcrumb";
import PrivateLayout from "@/components/layout/dashboard";
import SettingsPage from "@/components/pages/dashboard/setting/form";
import { sitekey } from "@/config/setting";
import SettingServices from "@/helper/services/SettingServices";
import React, { Suspense } from "react";


const Page = async () => {
  const setting = await SettingServices.getOnlineStoreSetting(sitekey);
  return (
    <PrivateLayout>
      <div className="mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumbs heading={"Settings"} desc={"Configure your site settings, including basic, contact, and security settings"} btn={{ show: false }} />
          <div className="rounded-md shadow-sm overflow-auto">
            <SettingsPage settings={setting} />
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
};

export default Page;

