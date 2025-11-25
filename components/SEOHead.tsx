
import React from 'react';
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
      "reviewCount": "24",
      "bestRating": "5",
      "worstRating": "1"
    }
  } : null;

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
    <>
      <title>{siteTitle}</title>
      
      {/* Basic Meta */}
      <meta name="description" content={description} />
      <meta name="theme-color" content="#020617" />
      <link rel="icon" href="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3cpath d='M78.6,21.4C71.3,14.1,60.8,10,50,10C30.7,10,15,25.7,15,45c0,8.3,2.8,15.9,7.6,21.8 M21.4,78.6c7.3,7.3,17.8,11.4,28.6,11.4c19.3,0,35-15.7,35-35c0-8.3-2.8-15.9-7.6-21.8' stroke='%233b82f6' stroke-width='12' fill='none' stroke-linecap='round'/%3e%3c/svg%3e" />
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />

      {/* Font Preconnects & Loading */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,300;1,400&family=Roboto+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />

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

      {/* Structured Data */}
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
    </>
  );
};

export default SEOHead;