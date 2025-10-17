// import LoginPage from "@/app/c";
import { PublicLayout } from "@/components/layout/main-layout";
import { LoginCard } from "@/components/pages/auth/login-card";
import LoginPage from "@/components/pages/auth/login-form";

export default function ForgotPasswordPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        {/* Demo container showing the login card in different contexts */}
        <div className="w-full max-w-6xl space-y-12">
          {/* Main demo section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Production-Grade Login UI
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Enterprise-ready authentication component with credential and
              social login, privacy compliance, security features, and
              comprehensive user experience design.
            </p>
          </div>

          {/* Centered login card */}
          <div className="flex justify-center">
            <LoginCard />
          </div>

          {/* Additional demo showing embedding flexibility */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Enterprise Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Complete Authentication
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Email/password, social login, registration, and password
                  recovery
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Privacy Compliance
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Terms of service, privacy policy, and GDPR-ready consent flows
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Security Features
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Password validation, secure forms, and encrypted data handling
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  User Experience
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading states, form validation, hover tooltips, and smooth
                  animations
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Accessibility
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  WCAG compliant, keyboard navigation, screen reader support
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Developer Ready
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  TypeScript, modular design, easy integration, comprehensive
                  logging
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
