"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

export default function Breadcrumbs({
  btn,
  heading,
  desc,
  btnComp,
}: {
  btn?: { show?: boolean; cond?: boolean; event?: () => void; label?: string };
  heading?: string;
  desc?: string;
  btnComp?: React.ReactNode;
}) {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, arr) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: "/" + arr.slice(0, index + 1).join("/"),
      isLast: index === arr.length - 1,
    }));

  return (
    <div className="flex flex-wrap justify-between items-center gap-3 mb-4 border-b border-gray-200 dark:border-gray-800  p-2">
      {/* Left: Heading & Breadcrumb */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
          {heading || segments[segments.length - 1]?.label}
        </h1>

        {desc && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
        )}

        <nav className="text-sm flex flex-wrap gap-1 text-gray-700 dark:text-gray-300">
          {segments.map((seg, idx) => (
            <React.Fragment key={seg.href}>
              {seg.isLast ? (
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  {seg.label}
                </span>
              ) : (
                <Link
                  href={seg.href}
                  className="hover:text-gray-900 dark:hover:text-white hover:underline transition-colors"
                >
                  {seg.label}
                </Link>
              )}
              {idx < segments.length - 1 && (
                <span className="text-gray-400 dark:text-gray-600">/</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Button or Custom Component */}
      <div className="flex items-center gap-2">
        {btn?.show && (
          <>
            {btn.event ? (
              <Button
                onClick={btn.event}
                className="px-4 py-2 font-medium rounded-md bg-primary text-white hover:bg-primary/90 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition"
              >
                {btn.label || "Add"}
              </Button>
            ) : (
              <Link
                href={`${pathname}/create`}
                className="px-4 py-2 font-medium rounded-md bg-primary text-white hover:bg-primary/90 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition"
              >
                {btn.label || "Add"}
              </Link>
            )}
          </>
        )}
        {btnComp && <div>{btnComp}</div>}
      </div>
    </div>
  );
}
