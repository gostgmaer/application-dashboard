import { PublicLayout } from "@/components/layout/main-layout";
import LoginForm from "@/components/pages/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | NextAuth",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto ">
        <div className="mx-auto  rounded-lg shadow-md">
          <LoginForm />
        </div>
      </div>
    </PublicLayout>
  );
}
