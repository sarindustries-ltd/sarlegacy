declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

// Initialize Facebook Pixel
export const initPixel = (pixelId: string) => {
  if (typeof window === 'undefined') return;

  if (window.fbq) return;

  const n: any = (window as any).fbq = function() {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };

  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = !0;
  n.version = '2.0';
  n.queue = [];

  const t = document.createElement('script');
  t.async = !0;
  t.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const s = document.getElementsByTagName('script')[0];
  if (s && s.parentNode) {
    s.parentNode.insertBefore(t, s);
  }

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
};

// Standard Facebook Event Names
type StandardEvent = 
  | 'ViewContent' 
  | 'AddToCart' 
  | 'Purchase' 
  | 'InitiateCheckout' 
  | 'Search' 
  | 'AddToWishlist'
  | 'Contact'
  | 'CompleteRegistration';

// Track Standard Events with strict payload typing for Catalog Matching
export const trackEvent = (
  event: StandardEvent, 
  data?: {
    content_name?: string;
    content_ids?: string[]; // CRITICAL: Must match Catalog IDs
    content_type?: 'product' | 'product_group';
    value?: number;
    currency?: string;
    num_items?: number;
    search_string?: string;
    content_category?: string;
    [key: string]: any;
  }
) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, data);
    // Debug log for development verification
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[Pixel] Tracked ${event}`, data);
    }
  }
};