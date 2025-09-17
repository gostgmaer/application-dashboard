import { Suspense } from "react";
import Table from "@/components/pages/dashboard/users/roles/table";
import roleServices from "@/helper/services/roleServices";
import PrivateLayout from "@/components/layout/dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { headersToken } from "@/lib/utils/utils";

export default async function Page(props: any) {
  const query = await props.searchParams;
  const session = await getServerSession(authOptions);
  const data = await roleServices.getAll(
    query,
    headersToken(session?.accessToken)
  );

  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <Table props={{ ...data }} />
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
