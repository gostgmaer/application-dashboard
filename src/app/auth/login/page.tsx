// import LoginPage from "@/app/c";
import { PublicLayout } from "@/components/layout/main-layout";
import { LoginCard } from "@/components/pages/auth/login-card";
import LoginPage from "@/components/pages/auth/login-form";

export default function ForgotPasswordPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="flex justify-center">
          <LoginCard />
        </div>
      </div>
    </PublicLayout>
  );
}
