import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

export const metadata = { title: "חיפוש | TikTime" };

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-[#c9a96e] border-t-transparent rounded-full" /></div>}>
      <SearchPageClient />
    </Suspense>
  );
}
