/**
 * Email Service
 * Uses nodemailer. Configure SMTP in .env.local
 */

import nodemailer from "nodemailer";
import type { OrderWithItems } from "@/types";
import { formatPrice, formatDateTime } from "@/lib/utils";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ============================================================
// ORDER CONFIRMATION — to customer
// ============================================================
export async function sendOrderConfirmationEmail(order: OrderWithItems) {
  if (!process.env.SMTP_USER) {
    console.log("[Email] SMTP not configured, skipping order confirmation email");
    return;
  }

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${item.productName}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:left;">${formatPrice(item.productPrice)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:left;">${formatPrice(item.subtotal)}</td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head><meta charset="UTF-8" /><style>
body { font-family: 'Arial', sans-serif; color: #222; background: #fff; direction: rtl; }
.container { max-width: 600px; margin: 0 auto; padding: 20px; }
.header { background: #222021; padding: 24px; text-align: center; }
.header img { height: 50px; }
.header h1 { color: #c9a96e; font-size: 22px; margin: 12px 0 0; }
.content { padding: 24px 0; }
.order-number { background: #f8f8f8; border-right: 4px solid #c9a96e; padding: 12px 16px; margin: 16px 0; font-size: 18px; font-weight: bold; }
table { width: 100%; border-collapse: collapse; margin: 16px 0; }
th { background: #f5f5f5; padding: 10px 12px; text-align: right; font-weight: bold; }
.total { background: #222021; color: #fff; padding: 12px 16px; text-align: left; font-size: 18px; font-weight: bold; }
.footer { background: #f5f5f5; padding: 16px; text-align: center; font-size: 13px; color: #888; margin-top: 24px; }
</style></head>
<body>
<div class="container">
  <div class="header">
    <h1>תודה על הזמנתך!</h1>
  </div>
  <div class="content">
    <p>שלום ${order.customerName},</p>
    <p>ההזמנה שלך התקבלה בהצלחה.</p>
    <div class="order-number">מספר הזמנה: ${order.orderNumber}</div>
    <p><strong>תאריך:</strong> ${formatDateTime(order.createdAt)}</p>
    <h3>פרטי ההזמנה:</h3>
    <table>
      <thead><tr>
        <th>מוצר</th><th>כמות</th><th>מחיר</th><th>סה"כ</th>
      </tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <div class="total">סה"כ לתשלום: ${formatPrice(order.totalAmount)}</div>
    <h3>פרטי משלוח:</h3>
    <p>${order.customerAddress}</p>
    <p>נהיה בקשר בקרוב! לכל שאלה: <a href="mailto:${process.env.ADMIN_EMAIL}">צור קשר</a></p>
  </div>
  <div class="footer">
    טיק טיים © ${new Date().getFullYear()} | שעוני יוקרה מקוריים
  </div>
</div>
</body>
</html>`;

  try {
    await getTransporter().sendMail({
      from: `"טיק טיים" <${process.env.SMTP_USER}>`,
      to: order.customerEmail,
      subject: `אישור הזמנה #${order.orderNumber} - טיק טיים`,
      html,
    });
  } catch (err) {
    console.error("[Email] Failed to send order confirmation:", err);
  }
}

// ============================================================
// NEW ORDER NOTIFICATION — to admin
// ============================================================
export async function sendNewOrderAdminEmail(order: OrderWithItems) {
  if (!process.env.SMTP_USER || !process.env.ADMIN_EMAIL) {
    console.log("[Email] SMTP not configured, skipping admin notification");
    return;
  }

  const itemsList = order.items
    .map((item) => `• ${item.productName} × ${item.quantity} = ${formatPrice(item.subtotal)}`)
    .join("\n");

  const text = `
הזמנה חדשה! #${order.orderNumber}

לקוח: ${order.customerName}
טלפון: ${order.customerPhone}
אימייל: ${order.customerEmail}
כתובת: ${order.customerAddress}

מוצרים:
${itemsList}

סה"כ: ${formatPrice(order.totalAmount)}

לניהול ההזמנה: ${process.env.NEXTAUTH_URL}/admin/orders/${order.id}
`;

  try {
    await getTransporter().sendMail({
      from: `"טיק טיים" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🆕 הזמנה חדשה #${order.orderNumber} - ${formatPrice(order.totalAmount)}`,
      text,
    });
  } catch (err) {
    console.error("[Email] Failed to send admin notification:", err);
  }
}
