export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";

// /shop redirects to the men's watches category (main catalog)
export default function ShopPage() {
  redirect("/category/gevarim");
}
