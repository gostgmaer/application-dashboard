// app/products/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api/products-api";
import { ProductView } from "@/components/pages/dashboard/product/details/ProductView";

// Explicitly import Next.js types
import type { NextPage } from "next";

// Define the props interface to match Next.js dynamic route expectations
interface ProductPageProps {
  params: Promise<{ id: string }>; // params as Promise for dynamic route
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // searchParams as Promise
}

// Use NextPage type for the component
const ProductPage: NextPage<ProductPageProps> = async ({ params, searchParams }) => {
  try {
    // Resolve params to get id
    const { id } = await params;

    // Resolve searchParams and provide default empty object if undefined
    const resolvedSearchParams = (await searchParams) || {};

    // Extract searchParams with defaults
    const sort = typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : "default";
    const filter = typeof resolvedSearchParams.filter === "string" ? resolvedSearchParams.filter : "all";

    // Fetch product, potentially passing searchParams to API
    const product = await getProduct(id);

    // JSON-LD Schema
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description: product.shortDescription,
      image: product.images,
      brand: {
        "@type": "Brand",
        name: product.brand,
      },
      category: product.category,
      sku: product.sku,
      offers: {
        "@type": "Offer",
        price: product.price.discounted || product.price.original,
        priceCurrency: product.price.currency,
        availability:
          product.stock.status === "in_stock"
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
      },
      aggregateRating: product.averageRating
        ? {
            "@type": "AggregateRating",
            ratingValue: product.averageRating,
            reviewCount: product.totalReviews,
          }
        : undefined,
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ProductView
          productId={id}
          initialProduct={product}
        />
      </>
    );
  } catch {
    notFound();
  }
};

export default ProductPage;