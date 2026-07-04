import { notFound } from 'next/navigation'
import { shopifyFetch } from '@/lib/shopify/client'
import { GET_SHOP_POLICIES } from '@/lib/shopify/queries/policy'
import type { ShopifyPoliciesResponse } from '@/lib/shopify/types'
import Link from 'next/link'

interface Props {
  params: Promise<{ locale: string; handle: string }>
}

const STATIC_POLICIES: Record<string, { title: string; body: string }> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    body: `
      <p>Last updated: July 2026</p>
      <p>Nailestial ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, and disclose your personal information when you visit or make a purchase from our website.</p>
      
      <h2>1. Personal Information We Collect</h2>
      <p>When you visit the site, we collect certain information about your device, your interaction with the site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.</p>
      <ul>
        <li><strong>Order Information:</strong> Collected to process and fulfill your order. This includes your name, billing address, shipping address, email address, phone number, and payment information (processed securely via our third-party processors, Shopify and 2Checkout).</li>
        <li><strong>Device and Browsing Information:</strong> Collected automatically through technologies like cookies, log files, and pixels (including the Meta Pixel). This includes your IP address, browser type, pages viewed, and information about how you interact with our advertisements.</li>
      </ul>
      
      <h2>2. How We Use Your Personal Information</h2>
      <p>We use your personal information to provide our services to you, which includes: offering products for sale, processing payments, shipping and fulfillment of your order, keeping you up to date on new products and services, and retargeting ads via Meta Pixel based on your browsing behavior.</p>
      
      <h2>3. Sharing Personal Information</h2>
      <p>We share your Personal Information with third-party service providers to help us use your Personal Information, as described above:</p>
      <ul>
        <li><strong>Shopify:</strong> We use Shopify to power our online store. Shopify processes your personal data as a data processor on our behalf.</li>
        <li><strong>Meta (Facebook):</strong> We use the Meta Pixel to help deliver relevant advertisements to you on social platforms and to track the effectiveness of our ad campaigns.</li>
      </ul>
      
      <h2>4. Your Rights under GDPR and CCPA</h2>
      <p>If you are a resident of the European Economic Area (EEA) or California, you have certain privacy rights regarding your personal information, including the right to access, port, correct, update, or request erasure of your personal information. To exercise these rights, please contact us at our support email below.</p>
      
      <h2>5. Cookies and Tracking</h2>
      <p>Our website uses cookies and tracking technologies (including the Meta Pixel) to improve user experience, analyze site usage, and support our marketing efforts. You can choose to disable cookies through your browser settings, though doing so may limit your ability to use certain features of our site.</p>
      
      <h2>6. Contact Us</h2>
      <p>For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us at:</p>
      <p>
        <strong>Email:</strong> support@nailestial.com<br />
        <!-- TODO: If you get a domain email (e.g. support@nailestial.com), swap it here. -->
        <strong>Address:</strong> Ha Dong, Hanoi, Vietnam<br />
        <strong>Business Form:</strong> Individual Seller (Vietnam-based)
      </p>
    `
  },
  'terms-of-service': {
    title: 'Terms of Service',
    body: `
      <p>Last updated: July 2026</p>
      <p>Welcome to Nailestial. By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully.</p>
      
      <h2>1. Overview and Eligibility</h2>
      <p>This website is operated by Nailestial. Throughout the site, the terms "we", "us" and "our" refer to Nailestial. We offer this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.</p>
      <p>Nailestial is operated by an individual seller based in Vietnam. By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence.</p>
      
      <h2>2. Order Acceptance and Pricing</h2>
      <p>All product prices are displayed and charged in US Dollars (USD). We reserve the right to refuse or cancel any order for any reason, including product unavailability, inaccuracies in pricing or product descriptions, or issues identified by our fraud prevention systems.</p>
      
      <h2>3. Shipping and Customs</h2>
      <p>Products are handcrafted and shipped directly from Vietnam to addresses within the United States only. You, the customer, are responsible for ensuring that the shipping address is accurate. Any import duties, taxes, or custom clearance fees imposed by US authorities are the responsibility of the customer.</p>
      
      <h2>4. Intellectual Property</h2>
      <p>All content included on this site, such as text, graphics, logos, images, digital downloads, and product designs, is the property of Nailestial and is protected by international copyright and intellectual property laws.</p>
      
      <h2>5. Limitation of Liability</h2>
      <p>In no event shall Nailestial, its operators, or affiliates be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with the use of our website or the purchase and use of our products. Our total liability to you for any claim shall not exceed the amount paid by you for the product in question.</p>
      
      <h2>6. Governing Law</h2>
      <p>These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of Vietnam, and neutral international commercial principles, without giving effect to any principles of conflicts of law.</p>
      <!-- TODO: Revisit the governing law section once a formal business entity (e.g., US LLC) is established -->
      
      <h2>7. Contact Information</h2>
      <p>Questions about the Terms of Service should be sent to us at:</p>
      <p>
        <strong>Email:</strong> support@nailestial.com<br />
        <!-- TODO: If you get a domain email (e.g. support@nailestial.com), swap it here. -->
        <strong>Address:</strong> Ha Dong, Hanoi, Vietnam<br />
      </p>
    `
  },
  'refund-policy': {
    title: 'Refund and Return Policy',
    body: `
      <p>Last updated: July 2026</p>
      <p>At Nailestial, we take pride in the quality and craftsmanship of our handcrafted press-on nails. Because our products are custom-made and for hygiene reasons, we maintain a strict return policy.</p>
      
      <h2>1. 14-Day Return Request Window</h2>
      <p>You have 14 days from the date your package is marked as delivered by the carrier to request a return or exchange. Any requests made after this 14-day window will not be eligible for a refund or replacement.</p>
      
      <h2>2. Qualifying Conditions for Returns</h2>
      <p>Returns and exchanges are accepted <strong>ONLY</strong> for the following circumstances:</p>
      <ul>
        <li><strong>Damaged or Defective Items:</strong> If the product arrives broken, cracked, or significantly defective (e.g., damaged nails in transit).</li>
        <li><strong>Sizing Consultation Error:</strong> If you received an incorrect size due to a sizing consultation error directly attributable to guidance provided by Nailestial.</li>
      </ul>
      <p>Because press-on nails are personal hygiene products, items that have been opened, tried on, or worn are strictly <strong>not eligible</strong> for return or exchange under any other conditions, including general "change of mind" or purchasing the wrong size without consulting us.</p>
      
      <h2>3. Return Shipping Costs</h2>
      <p>If your return qualifies under the defect or sizing error conditions above, <strong>Nailestial will cover all return shipping costs</strong>. We will provide a prepaid shipping label for you to send the qualifying items back to us.</p>
      
      <h2>4. How to Request a Return</h2>
      <p>To request a return or exchange, please follow these steps:</p>
      <ol>
        <li>Inspect your products immediately upon arrival.</li>
        <li>If you detect a defect or size consultation error, email us at <strong>support@nailestial.com</strong> within 14 days of delivery.</li>
        <!-- TODO: If you get a domain email (e.g. support@nailestial.com), swap it here. -->
        <li>In your email, include your <strong>Order Number</strong>, a brief explanation of the issue, and <strong>clear photos</strong> showing the defect or sizing mismatch.</li>
        <li>Once we review and approve your request, we will email you a prepaid return shipping label and detailed return instructions.</li>
      </ol>
      <p>Do not send items back to us without receiving prior approval and a return label from our team.</p>
    `
  },
  'shipping-policy': {
    title: 'Shipping Policy',
    body: `
      <p>Last updated: July 2026</p>
      <p>Thank you for shopping at Nailestial. Below are the terms and conditions that constitute our Shipping Policy.</p>
      
      <h2>1. Shipping Destination Restrictions</h2>
      <p>We currently ship <strong>exclusively to addresses within the United States</strong>. We do not ship to P.O. Boxes, APO/FPO addresses, or any international destinations outside of the US at this time.</p>
      
      <h2>2. Origin and Processing Times</h2>
      <p>All our press-on nails are individually handcrafted to order in our studio in Vietnam. Please allow 3-7 business days for production and order preparation before shipment.</p>
      
      <h2>3. Estimated Delivery Timelines</h2>
      <p>Once shipped from Vietnam, the estimated delivery time to United States destinations is <strong>approximately 14 days</strong>.</p>
      <p>Please note that shipping times are estimates and are not guaranteed. Actual delivery dates may vary due to customs clearance procedures, carrier delays, adverse weather conditions, or other international transit factors beyond our control.</p>
      
      <h2>4. Shipping Costs</h2>
      <p>Shipping rates for your order will be calculated and displayed at checkout.</p>
      <p>
        <strong>Standard Shipping:</strong> [Insert shipping cost/free shipping threshold]<br />
        <!-- TODO: Update with your finalized shipping cost or free shipping threshold -->
      </p>
      
      <h2>5. Tracking Information</h2>
      <p>Once your order has shipped, you will receive a confirmation email containing your tracking number. Tracking updates may take 24-48 hours to activate as the package moves through initial international hubs.</p>
      
      <h2>6. Lost or Damaged Packages</h2>
      <p>If your package is damaged in transit, please save all packaging materials and damaged goods, and contact us immediately at <strong>support@nailestial.com</strong> so we can assist you with a replacement or claim.</p>
      <!-- TODO: If you get a domain email (e.g. support@nailestial.com), swap it here. -->
    `
  }
}

const HANDLE_MAP: Record<string, keyof ShopifyPoliciesResponse['shop']> = {
  'shipping-policy': 'shippingPolicy',
  'privacy-policy': 'privacyPolicy',
  'refund-policy': 'refundPolicy',
  'terms-of-service': 'termsOfService',
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const { handle } = params
  const policy = STATIC_POLICIES[handle]

  if (policy) {
    return {
      title: `${policy.title} | Nailestial`,
      description: `Official ${policy.title} page for Nailestial - premium handcrafted press-on nails.`,
    }
  }

  return {
    title: 'Store Policy | Nailestial',
    description: 'Read our customer terms and store policies.',
  }
}

export default async function PolicyPage(props: Props) {
  const params = await props.params
  const { handle, locale } = params

  const queryKey = HANDLE_MAP[handle]
  
  // Look up static policy content first
  let policy = STATIC_POLICIES[handle]

  // Fallback to Shopify query if static dictionary does not match but the handle is recognized by Shopify
  if (!policy && queryKey) {
    try {
      const data = await shopifyFetch<ShopifyPoliciesResponse>(
        GET_SHOP_POLICIES,
        {}
      )
      const shopifyPolicy = data?.shop?.[queryKey]
      if (shopifyPolicy) {
        policy = {
          title: shopifyPolicy.title,
          body: shopifyPolicy.body
        }
      }
    } catch (e) {
      console.error('Failed to fetch policy from Shopify:', e)
    }
  }

  // If both static and shopify lookups fail, 404
  if (!policy) {
    notFound()
  }

  return (
    <main className="min-h-screen py-20 md:py-32 px-6 sm:px-12 md:px-24 bg-surface max-w-screen-2xl mx-auto">
      <div className="max-w-[800px] mx-auto">
        <Link href={`/${locale}`} className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-background transition-colors mb-12">
          <span className="material-symbols-outlined mr-2" style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: '18px' }}>arrow_back</span>
          Back to Home
        </Link>
        <header className="mb-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-6">
            CURRENT PROVISIONS IN EFFECT
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-normal tracking-normal text-on-background leading-tight">
            {policy.title}
          </h1>
        </header>

        <div 
          className="space-y-8 text-on-surface-variant font-sans font-light text-sm leading-[1.6] 
                     [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:font-normal [&_h2]:text-on-background [&_h2]:mt-16 [&_h2]:mb-6
                     [&_h3]:font-mono [&_h3]:text-[10px] [&_h3]:tracking-[0.2em] [&_h3]:uppercase [&_h3]:text-on-background [&_h3]:mt-8 [&_h3]:mb-4
                     [&_p]:mb-6 [&_p]:text-on-surface-variant
                     [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-6 [&_ul]:space-y-3 [&_ul]:text-on-surface-variant
                     [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-6 [&_ol]:space-y-3 [&_ol]:text-on-surface-variant
                     [&_li]:pl-2
                     [&_a]:font-normal [&_a]:underline [&_a]:decoration-outline/30 [&_a]:underline-offset-4 [&_a]:hover:decoration-on-background [&_a]:text-on-background [&_a]:transition-colors"
          dangerouslySetInnerHTML={{ __html: policy.body }} 
        />
        
        <div className="pt-24 mt-24 border-t border-outline/20 text-center">
            <p className="font-serif text-xl text-on-background">
                Questions? Contact our support team at <Link className="font-normal italic underline decoration-outline/30 underline-offset-4 hover:decoration-on-background transition-colors duration-200" href={`/${locale}/contact`}>Contact Page</Link>
            </p>
        </div>
      </div>
    </main>
  )
}
