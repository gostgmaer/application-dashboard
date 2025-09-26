// import LoginPage from "@/app/c";
import { PublicLayout } from "@/components/layout/main-layout";
import ContactForm from "@/components/pages/auth/contact";

// export const metadata: Metadata = {
//   title: "Reset Password | NextAuth",
//   description: "Reset your password",
// };

export default function ForgotPasswordPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto ">
        <div className="mx-auto  rounded-lg shadow-md">
        <ContactForm></ContactForm>
        </div>
      </div>
    </PublicLayout>
  );
}
