import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Shield, UserPlus, Lock, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Secure Authentication for Your Next Project
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive authentication system with multi-step registration, secure login, and full user management capabilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" asChild>
              <Link href="/auth/login">Get Started</Link>
            </Button>
            {/* <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-t">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Key Features</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Our authentication system provides everything you need for secure user management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Comprehensive Registration</h3>
            <p className="text-muted-foreground">
              Multi-step registration process that collects all necessary user information while maintaining a smooth user experience.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
            <p className="text-muted-foreground">
              Industry-standard security practices including password hashing, two-factor authentication, and secure token handling.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Password Recovery</h3>
            <p className="text-muted-foreground">
              Simple and secure password recovery flow with email verification for account protection.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email Verification</h3>
            <p className="text-muted-foreground">
              Verify user emails to ensure authentic registrations and reduce spam accounts.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M12 2v5" />
                <path d="M12 17v5" />
                <path d="M4.93 4.93l3.54 3.54" />
                <path d="M15.54 15.54l3.54 3.54" />
                <path d="M2 12h5" />
                <path d="M17 12h5" />
                <path d="M4.93 19.07l3.54-3.54" />
                <path d="M15.54 8.45l3.54-3.54" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Theme Customization</h3>
            <p className="text-muted-foreground">
              Switch between light, dark, and system-preferred themes for comfortable viewing in any environment.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 3v18" />
                <path d="M3 7.5h4" />
                <path d="M3 12h4" />
                <path d="M3 16.5h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Form Validation</h3>
            <p className="text-muted-foreground">
              Robust form validation using Yup schema validation to ensure data integrity and user guidance.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t">
        <div className="bg-card rounded-xl p-8 md:p-12 shadow-sm">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-muted-foreground">
              Create your account now and experience our comprehensive authentication system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              {/* <Button size="lg" asChild>
                <Link href="/auth/register">Register Now</Link>
              </Button> */}
              <Button size="lg"  asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}