
// import LoginPage from "@/app/c";
import { PublicLayout } from "@/components/layout/main-layout";
import LoginPage from "@/components/pages/auth/login-form";
import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Reset Password | NextAuth",
//   description: "Reset your password",
// };

export default function ForgotPasswordPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto ">
        <div className="mx-auto  rounded-lg shadow-md">
        <LoginPage></LoginPage>
        </div>
      </div>
    </PublicLayout>
  );
}
