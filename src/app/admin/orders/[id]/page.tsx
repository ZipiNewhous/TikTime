import { notFound } from "next/navigation";
import prisma from "@/lib/db/prisma";
import OrderDetailClient from "./OrderDetailClient";

export const metadata = { title: "פרטי הזמנה" };

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = parseInt(id);
  if (isNaN(orderId)) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: { select: { name: true, slug: true, image1: true, sku: true } },
        },
      },
    },
  });

  if (!order) notFound();

  return <OrderDetailClient order={order as any} />;
}
