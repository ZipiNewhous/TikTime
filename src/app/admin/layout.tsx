import AdminSidebar from "@/components/admin/AdminSidebar";
import { ToastContainer } from "@/components/ui/Toast";

export const metadata = {
  title: {
    default: "Admin | טיק טיים",
    template: "%s | Admin טיק טיים",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f0f0f5]" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <ToastContainer />
    </div>
  );
}
