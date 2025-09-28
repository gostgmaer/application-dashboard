import { Suspense } from "react";
import Table from "@/components/pages/dashboard/product/brand/table";
import brandService from "@/lib/http/brands";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
export default async function UsersPage(props: any) {
  const query = await props.searchParams;
  const session = await getServerSession(authOptions);
  // const {sortBy,sortDesc} = query
  const brands = await brandService.getPaginated(query, session?.accessToken);
  // console.log(product);

  return (
    <div className=" mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <Table props={{ ...brands }} />
      </Suspense>
    </div>
  );
}
