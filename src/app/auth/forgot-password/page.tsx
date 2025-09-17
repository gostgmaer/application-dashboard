// import { ForgotPasswordForm } from '@/components/pages/auth/forgot-password-form';
import { PublicLayout } from "@/components/layout/main-layout";
import ForgotPasswordForm from "@/components/pages/auth/forgot-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | NextAuth",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto ">
        <div className="mx-auto  rounded-lg shadow-md">
          <ForgotPasswordForm />
        </div>
      </div>
    </PublicLayout>
  );
}
