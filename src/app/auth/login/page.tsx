
// import LoginPage from "@/app/c";
import { PublicLayout } from "@/components/layout/main-layout";
import LoginPage from "@/components/pages/auth/login-form";


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
