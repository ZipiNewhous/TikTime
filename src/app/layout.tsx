import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "טיק טיים | שעוני יוקרה מקוריים",
    template: "%s | טיק טיים",
  },
  description:
    "טיק טיים - חנות שעוני יוקרה ומותגים מקוריים אונליין. שעונים בעיצובים יוקרתיים במחירים נוחים ומשלוח חינם.",
  keywords: ["שעוני יוקרה", "שעונים מקוריים", "Rolex", "Omega", "Tissot", "טיק טיים"],
  openGraph: {
    title: "טיק טיים | שעוני יוקרה מקוריים",
    description: "חנות שעוני יוקרה ומותגים מקוריים אונליין",
    siteName: "טיק טיים",
    locale: "he_IL",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
