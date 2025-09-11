
import React from "react";
import Breadcrumbs from "./breadcrumb";

export default function PageElement({children}: {children: React.ReactNode}) {


  return (
    <div className="space-y-6  text-black  dark:text-white min-h-screen">
      {/* 🏷️ Heading + Add Button */}
      <Breadcrumbs />

      {/* 🔲 Element */}
      <section className="rounded-md border border-gray-300  p-6 bg-gray-50  shadow-sm">
       {children}
      </section>
    </div>
  );
}
