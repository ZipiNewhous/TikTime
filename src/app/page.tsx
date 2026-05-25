import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import { ToastContainer } from "@/components/ui/Toast";
import HeroSection from "@/components/store/HeroSection";
import BrandsSlider from "@/components/store/BrandsSlider";
import CategoryCards from "@/components/store/CategoryCards";
import AboutSection from "@/components/store/AboutSection";
import TestimonialsSection from "@/components/store/TestimonialsSection";
import BottomBanners from "@/components/store/BottomBanners";
import BenefitsSection from "@/components/store/BenefitsSection";
import NewsletterSection from "@/components/store/NewsletterSection";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tiktime.co.il";

export const metadata: Metadata = {
  title: "שעוני יוקרה מקוריים | טיק טיים",
  description:
    "טיק טיים - חנות שעוני יוקרה ומותגים מקוריים. Rolex, Omega, Tissot ועוד. משלוח חינם לכל הארץ.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "TikTime",
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
      telephone: "+972-54-845-2098",
      email: "tiktime10@gmail.com",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+972-54-845-2098",
        contactType: "customer service",
        availableLanguage: "Hebrew",
      },
      sameAs: [
        "https://www.facebook.com/tiktime10/",
        "https://www.instagram.com/tiktime10/",
      ],
    },
    {
      "@type": "WebSite",
      name: "TikTime",
      url: BASE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        {/* 1. Hero slider */}
        <HeroSection />

        {/* 2. Brand logos auto-scroll strip */}
        <BrandsSlider />

        {/* 3. Heading */}
        <div className="bg-white py-10 text-center border-b border-gray-100">
          <h1 className="text-[28px] font-bold text-[#222222] tracking-tight">
            שעוני יוקרה ומותגים מקוריים
          </h1>
          <div className="w-12 h-0.5 bg-[#c9a96e] mx-auto mt-3" />
        </div>

        {/* 4. Category cards */}
        <CategoryCards />

        {/* 5. קצת עלינו */}
        <AboutSection />

        {/* 6. Customer testimonials + watch image side by side */}
        <TestimonialsSection />

        {/* 7. Bottom banners */}
        <BottomBanners />

        {/* 8. Benefits — 6 icons on dark background + OUR BENEFITS title */}
        <BenefitsSection />

        {/* 9. Newsletter */}
        <NewsletterSection />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}
