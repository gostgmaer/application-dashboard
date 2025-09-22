// app/products/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api/products-api";
import { ProductView } from "@/components/pages/dashboard/product/details/ProductView";

interface ProductPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const product = await getProduct(params.id);

    return {
      title: product.seoTitle || `${product.title} - Your Store`,
      description: product.seoDescription || product.shortDescription,
      openGraph: {
        title: product.title,
        description: product.shortDescription,
        images: product.images.map((img) => ({ url: img })),
        type: "website",
      },
      other: {
        "product:price:amount": product.price.original.toString(),
        "product:price:currency": product.price.currency,
      },
    };
  } catch {
    return {
      title: "Product Not Found",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
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
}
