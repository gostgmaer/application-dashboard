// components/ErrorBoundary.tsx
"use client";
import React from "react";

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error("Global React Error Caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center text-red-600 dark:text-red-400">
          <h2 className="text-xl font-semibold">Something went wrong 😞</h2>
          <p className="mt-2">{String(this.state.error)}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
