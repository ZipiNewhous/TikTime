import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      notes,
      items, // [{ productId, quantity }]
    } = body;

    // Validation
    if (!customerName || !customerPhone || !customerEmail || !customerAddress) {
      return NextResponse.json({ error: "יש למלא את כל שדות החובה" }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "העגלה ריקה" }, { status: 400 });
    }

    // Fetch product details (for price snapshot)
    const productIds = items.map((i: { productId: number }) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "מוצר אחד או יותר אינו זמין" }, { status: 400 });
    }

    // Build order items
    const orderItems = items.map((item: { productId: number; quantity: number }) => {
      const product = products.find((p) => p.id === item.productId)!;
      const price = product.salePrice ?? product.price;
      return {
        productId: product.id,
        productName: product.name,
        productPrice: price,
        quantity: item.quantity,
        subtotal: price * item.quantity,
      };
    });

    const totalAmount = orderItems.reduce(
      (sum: number, i: { subtotal: number }) => sum + i.subtotal,
      0
    );

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName,
        customerPhone,
        customerEmail,
        customerAddress,
        notes: notes || null,
        totalAmount,
        status: "new",
        paymentStatus: "pending",
        items: { create: orderItems },
      },
      include: { items: true },
    });

    // Send emails (non-blocking)
    sendOrderConfirmationEmail(order).catch(console.error);
    sendNewOrderAdminEmail(order).catch(console.error);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
    });
  } catch (err) {
    console.error("[POST /api/orders]", err);
    return NextResponse.json({ error: "שגיאה ביצירת ההזמנה" }, { status: 500 });
  }
}
