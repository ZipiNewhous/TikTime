import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import FloatingSidebar from "@/components/layout/FloatingSidebar";
import { ToastContainer } from "@/components/ui/Toast";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
      <FloatingSidebar />
    </>
  );
}
