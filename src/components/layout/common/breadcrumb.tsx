"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

export default function Breadcrumbs({ btn }) {
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
    <div className="flex justify-between items-center mb-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {segments[segments.length - 1]?.label || "Dashboard"}
        </h1>
        <nav className="text-sm text-gray-700 dark:text-gray-300 flex flex-wrap gap-1">
          {segments.map((seg, idx) => (
            <React.Fragment key={seg.href}>
              {seg.isLast ? (
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  {seg.label}
                </span>
              ) : (
                <Link href={seg.href} className="hover:underline">
                  {seg.label}
                </Link>
              )}
              {idx < segments.length - 1 && <span>/</span>}
            </React.Fragment>
          ))}
        </nav>
      </div>
      <>
        {btn ? (
          <Button
            onClick={btn.event}
            className="px-4 py-2 rounded border border-white text-white bg-black hover:bg-white hover:text-black transition dark:border-black dark:text-black dark:bg-white dark:hover:bg-black dark:hover:text-white"
          >
            Add
          </Button>
        ) : (
          <Link
            href={`${pathname}/create`}
            className="px-4 py-2 rounded border border-white text-white bg-black hover:bg-white hover:text-black transition dark:border-black dark:text-black dark:bg-white dark:hover:bg-black dark:hover:text-white"
          >
            Add
          </Link>
        )}
      </>
    </div>
  );
}
