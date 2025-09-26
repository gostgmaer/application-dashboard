// app/products/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api/products-api";
import { ProductView } from "@/components/pages/dashboard/product/details/ProductView";

// Explicitly import Next.js types to ensure compatibility
import type { NextPage } from "next";

// Define the props interface to match Next.js dynamic route expectations
interface ProductPageProps {
  params: { id: string }; // Non-promise params
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Use NextPage type for the component to align with Next.js expectations
const ProductPage: NextPage<ProductPageProps> = async ({ params }) => {
  try {
    const product = await getProduct(params.id);

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
        <ProductView productId={params.id} initialProduct={product} />
      </>
    );
  } catch {
    notFound();
  }
};



export default ProductPage;