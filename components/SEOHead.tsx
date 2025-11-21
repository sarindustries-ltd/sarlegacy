
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Product } from '../types';
import { APP_NAME, CURRENCY } from '../constants';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'product';
  url?: string;
  product?: Product;
}

const SEOHead: React.FC<SEOHeadProps> = ({ 
  title = APP_NAME, 
  description = "Premium futuristic commerce for the modern era. Experience precision engineering and digital aesthetics.", 
  image = "https://picsum.photos/1200/630", 
  type = 'website',
  url = typeof window !== 'undefined' ? window.location.href : '',
  product
}) => {
  const siteTitle = title === APP_NAME ? title : `${title} | ${APP_NAME}`;

  // 1. Product Schema (JSON-LD) for Google Rich Results
  // This helps display Price, Availability, and Stars directly in Google Search
  const productSchema = product ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [product.image],
    "description": product.description,
    "sku": product.id.toString(),
    "mpn": product.id.toString(),
    "brand": {
      "@type": "Brand",
      "name": APP_NAME
    },
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": CURRENCY,
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": APP_NAME
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": "24", // In a real app, this would be dynamic
      "bestRating": "5",
      "worstRating": "1"
    }
  } : null;

  // 2. Breadcrumb Schema for better navigation understanding
  const breadcrumbSchema = product ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": window.location.origin
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": product.category,
        "item": `${window.location.origin}/category/${product.category.toLowerCase()}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": url
      }
    ]
  } : null;

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph / Facebook - Critical for Dynamic Ads */}
      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />

      {/* Product Specific OG Tags for Catalog Matching */}
      {product && (
        <>
          <meta property="product:brand" content={APP_NAME} />
          <meta property="product:availability" content="in stock" />
          <meta property="product:condition" content="new" />
          <meta property="product:price:amount" content={product.price.toString()} />
          <meta property="product:price:currency" content={CURRENCY} />
          <meta property="product:retailer_item_id" content={product.id.toString()} />
          <meta property="product:category" content={product.category} />
        </>
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data Injection */}
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
