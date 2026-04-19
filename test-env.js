require('dotenv').config({ path: '.env.local' });
console.log('[Shopify Debug] Starting Request to Domain:', process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'Missing');
console.log('[Shopify Debug] Token starts with:', process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ? process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN.substring(0, 4) : 'Missing');
