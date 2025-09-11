"use client";


import { EmailVerification } from "@/components/pages/auth/email-verification";
import { Suspense } from "react";
export default function VerifyEmailPage() {


  return (
    <div className="container mx-auto py-10 md:py-20">
      <div className="mx-auto max-w-xl space-y-6 bg-card p-8 rounded-lg shadow-md">
        <Suspense >
          <EmailVerification />
        </Suspense>
      </div>
    </div>
  );
}
