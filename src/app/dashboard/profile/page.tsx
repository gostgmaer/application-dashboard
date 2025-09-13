
import { getServerSession } from 'next-auth';

import Breadcrumbs from '@/components/layout/common/breadcrumb';
import Profile from '@/components/pages/dashboard/profile';
import { Suspense } from 'react';
import userServices from '@/helper/services/userService';
import { authOptions } from '@/app/api/auth/authOptions';
 // Adjust path based on your project structure

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    throw new Error('Unauthorized');
  }
  console.log(session,accessToken);
  

  const userData = await userServices.getProfile(session.accessToken);

  return (
    <div className="mx-auto py-2 overflow-hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <Breadcrumbs heading="My Profile" btn={{ show: false }} />
        <div className="rounded-md   shadow-sm overflow-auto ">
          <Profile userData={userData.data} />
        </div>
      </Suspense>
    </div>
  );
}
