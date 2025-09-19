"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Send,
  CheckCircle2,
} from "lucide-react";
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
  resetPasswordFormSchema,
  type ResetPasswordFormData,
} from "@/lib/validation-schemas";
import { useRouter, useSearchParams } from "next/navigation";
import authService from "@/helper/services/authServices";
export default function ResetPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const router = useRouter();
  const query = useSearchParams();
  const token = query.get("resetToken");
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);

    try {
      const response = await authService.resetPassword(token, data);
      console.log(response);

      if (response.error) {
        throw new Error(response.error || "Failed to reset password");
      }

      setIsSubmitted(true);
      form.reset();

      toast({
        title: "Password reset successful!",
        description: "Your password has been updated. You can now sign in.",
        duration: 5000,
      });

      // Redirect to login after 3 seconds
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (error) {
      toast({
        title: "Failed to reset password",
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
    <div className="min-h-screen flex items-center justify-center px-4 transition-colors">
      <div className="absolute top-4 right-4"></div>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Reset Your Password
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enter your new password below to secure your account.
          </p>
        </div>

        <Card className="shadow-xl border-1 border-cyan-500 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              New Password
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Create a strong password for your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Password Reset!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Your password has been successfully updated. Redirecting you
                  to the sign in page...
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
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          New Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your new password"
                              {...field}
                              className="h-11 pr-10 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-2 h-6 w-6 p-0"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Confirm New Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your new password"
                              {...field}
                              className="h-11 pr-10 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-2 h-6 w-6 p-0"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
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
                          Resetting Password...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Reset Password
                        </>
                      )}
                    </Button>

                    {!isFormValid && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        Please ensure passwords match and meet requirements.
                      </p>
                    )}
                  </div>
                </form>
              </Form>
            )}

            <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-800">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm font-medium transition-colors"
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
