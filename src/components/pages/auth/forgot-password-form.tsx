"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";
import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormData,
} from "@/lib/validation-schemas";
// import { forgotPasswordStart } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import authService from "@/lib/http/authService";
// import authService from "@/helper/services/authService";
// import authService from "@/lib/services/auth"
export default function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    // dispatch(forgotPasswordStart());

    try {
      const response = await authService.forgotPassword(data);
      console.log(response);

      if (response.error) {
        throw new Error(response.error || "Failed to send reset email");
      }

      setIsSubmitted(true);
      form.reset();

      toast({
        title: "Reset email sent!",
        description: "Check your inbox for password reset instructions.",
        duration: 5000,
      });

      // Reset success state after 5 seconds
      setTimeout(() => setIsSubmitted(false), 10000);
    } catch (error) {
      toast({
        title: "Failed to send reset email",
        description:
          error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    form.formState.isValid && Object.keys(form.formState.errors).length === 0;

  return (
    <div className="min-h-screen  flex items-center justify-center  px-4 transition-colors">
      <div className="absolute top-4 right-4"></div>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            No worries! Enter your email and we&apos;ll send you reset
            instructions.
          </p>
        </div>

        <Card className="shadow-xl border-1 border-cyan-500 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Reset Password
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Enter your email address to receive a password reset link
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Email Sent!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  We&apos;ve sent password reset instructions to your email
                  address. Please check your inbox and follow the link to reset
                  your password.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Didn&apos;t receive the email? Check your spam folder or try
                  again.
                </p>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            {...field}
                            className="h-11 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className={`w-full h-12 text-base font-medium transition-all duration-200 ${
                        isFormValid
                          ? " shadow-lg hover:shadow-xl "
                          : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-900"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Sending Reset Email...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Send Reset Email
                        </>
                      )}
                    </Button>

                    {!isFormValid && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        Please enter a valid email address to continue.
                      </p>
                    )}
                  </div>
                </form>
              </Form>
            )}

            <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-800">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm  font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
