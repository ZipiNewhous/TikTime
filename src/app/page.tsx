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

export const metadata: Metadata = {
  title: "שעוני יוקרה מקוריים | טיק טיים",
  description:
    "טיק טיים - חנות שעוני יוקרה ומותגים מקוריים. Rolex, Omega, Tissot ועוד. משלוח חינם לכל הארץ.",
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Hero slider */}
        <HeroSection />

        {/* 2. Brand logos auto-scroll strip */}
        <BrandsSlider />

        {/* 3. Heading */}
        <div className="bg-white py-10 text-center border-b border-gray-100">
          <h2 className="text-[28px] font-bold text-[#222222] tracking-tight">
            שעוני יוקרה ומותגים
          </h2>
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
