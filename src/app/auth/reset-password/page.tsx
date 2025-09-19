
import { PublicLayout } from "@/components/layout/main-layout";
import ResetPasswordForm from "@/components/pages/auth/resetPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | NextAuth",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto ">
        <div className="mx-auto  rounded-lg shadow-md">
          <ResetPasswordForm />
        </div>
      </div>
    </PublicLayout>
  );
}
