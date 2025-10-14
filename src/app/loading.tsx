import { Package } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loading | NextApp",
  description: "Loading content, please wait",
};

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="relative">
          <Package className="h-16 w-16 mx-auto mb-6 animate-spin text-primary" />
          <div className="absolute inset-0 h-16 w-16 mx-auto animate-ping">
            <Package className="h-16 w-16 text-primary/20" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-3 text-gradient">
          Loading Dashboard
        </h2>
        <p className="text-muted-foreground text-lg">
          Preparing your analytics and insights...
        </p>
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
