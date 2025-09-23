"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/useToast";
import { loginFormSchema, type LoginFormData } from "@/lib/validation-schemas";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { loginFailure, loginStart } from "@/store/slices/authSlice";
import TwoFactorModal from "./TwoFactorModal";

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [twoFAData, setTwoFAData] = useState<{
    tempUserId: string;
    otpType: "email" | "sms" | "authenticator";
    email: string;
  } | null>(null);

  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    dispatch(loginStart());

    try {
      const res: any = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!res?.ok) {
        // If the backend sent a JSON error indicating 2FA
        if (res.error?.startsWith("{") && res.error.includes("requiresTwoFactor")) {
          const err = JSON.parse(res.error);
          setTwoFAData({
            tempUserId: err.tempUserId,
            otpType: err.otpType,
            email: data.email,
          });
          return;
        }

        dispatch(loginFailure("An error occurred during sign in."));
        throw new Error(res.error || "Login failed");
      }

      // Successful login without 2FA
      if (res.url) {
        const parsedUrl = new URL(res.url);
        const callbackUrlParam = parsedUrl.searchParams.get("callbackUrl");
        router.push(callbackUrlParam ? decodeURIComponent(callbackUrlParam) : "/");
      }

      setIsSubmitted(true);
      toast({
        title: "Login successful!",
        description: "Welcome back! Redirecting to dashboard...",
        duration: 3000,
      });

      setTimeout(() => {
        setIsSubmitted(false);
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTwoFASuccess = async () => {
    await getSession();
    router.push("/");
  };

  const isFormValid =
    form.formState.isValid && Object.keys(form.formState.errors).length === 0;

  return (
    <div className="min-h-screen  flex items-center justify-center py-12 px-4 transition-colors">
      <div className="absolute top-4 right-4">{/* <ThemeToggle /> */}</div>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to your account to continue
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-gray-100/90 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Sign In
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
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
                          className="h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                            className="h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-0.5"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                            Remember me
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={`w-full h-12 text-base font-medium transition-all duration-200 ${
                      isFormValid
                        ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 shadow-lg hover:shadow-xl text-white"
                        : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Signing In...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                        Success!
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>

                  {!isFormValid && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Please fill in all fields correctly to enable sign in.
                    </p>
                  )}
                </div>
              </form>
            </Form>

            <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Want to Connact?{" "}
                <Link
                  href="/contact"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Contact here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {twoFAData && (
        <TwoFactorModal
          isOpen={true}
          onClose={() => setTwoFAData(null)}
          email={twoFAData.email}
          tempUserId={twoFAData.tempUserId}
          otpType={twoFAData.otpType}
          onSuccess={handleTwoFASuccess}
        />
      )}
    </div>
  );
}
