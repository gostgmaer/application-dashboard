
import ContactForm from '@/components/pages/auth/contact';
// import LoginForm from '@/components/pages/auth/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | NextAuth',
  description: 'Sign in to your account'
};

export default function LoginPage() {
  return (
    <div className="container mx-auto ">
      <div className="mx-auto  rounded-lg shadow-md">
        <ContactForm />
      </div>
    </div>
  );
}