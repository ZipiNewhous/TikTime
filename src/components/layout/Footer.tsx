import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Clock } from "lucide-react";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2d2d2d] text-white" dir="rtl">
      {/* Main columns */}
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1: מידע */}
          <div>
            <h3 className="font-bold text-sm tracking-widest text-white mb-5 uppercase">מידע</h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: "דף הבית", href: "/" },
                { label: "אודות", href: "/about" },
                { label: "צור קשר", href: "/contact" },
                { label: "מדיניות פרטיות", href: "/privacy" },
                { label: "תקנון", href: "/terms" },
                { label: "מדיניות משלוחים", href: "/shipping" },
                { label: "הצהרת נגישות", href: "/accessibility" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/55 hover:text-[#c9a96e] transition-colors text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: קטלוג */}
          <div>
            <h3 className="font-bold text-sm tracking-widest text-white mb-5 uppercase">קטלוג</h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: "שעוני גברים", href: "/category/gevarim" },
                { label: "שעוני נשים", href: "/category/nashim" },
                { label: "שעון לחתן", href: "/category/chatan" },
                { label: "שעוני כלות", href: "/category/kala" },
                { label: "כל המותגים", href: "/brands" },
                { label: "מבצעים", href: "/mivtzaim" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/55 hover:text-[#c9a96e] transition-colors text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: שירות לקוחות */}
          <div>
            <h3 className="font-bold text-sm tracking-widest text-white mb-5 uppercase">שירות לקוחות</h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: "מדיניות החזרות", href: "/shipping" },
                { label: "אחריות", href: "/about" },
                { label: "מדיניות משלוחים", href: "/shipping" },
                { label: "שאלות נפוצות", href: "/contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/55 hover:text-[#c9a96e] transition-colors text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: צור קשר */}
          <div>
            <h3 className="font-bold text-sm tracking-widest text-white mb-5 uppercase">צור קשר</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="https://wa.me/972548452098" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/55 hover:text-[#c9a96e] transition-colors text-sm">
                  <WhatsAppIcon />
                  054-8452098
                </a>
              </li>
              <li>
                <a href="tel:054-8452098"
                  className="flex items-center gap-2 text-white/55 hover:text-[#c9a96e] transition-colors text-sm">
                  <Phone className="h-4 w-4 shrink-0" />
                  054-8452098
                </a>
              </li>
              <li>
                <a href="mailto:tiktime10@gmail.com"
                  className="flex items-center gap-2 text-white/55 hover:text-[#c9a96e] transition-colors text-sm">
                  <Mail className="h-4 w-4 shrink-0" />
                  tiktime10@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/55 text-sm">
                <Clock className="h-4 w-4 shrink-0" />
                <span>א׳–ה׳: 09:00–16:00</span>
              </li>
            </ul>

            {/* Social */}
            <div className="flex gap-3 mt-5">
              <a href="https://www.facebook.com/tiktime10/" target="_blank" rel="noopener noreferrer"
                className="text-white/50 hover:text-[#1877f2] transition-colors" aria-label="פייסבוק">
                <FacebookIcon />
              </a>
              <a href="https://www.instagram.com/tiktime10/" target="_blank" rel="noopener noreferrer"
                className="text-white/50 hover:text-[#e1306c] transition-colors" aria-label="אינסטגרם">
                <InstagramIcon />
              </a>
              <a href="https://wa.me/972548452098" target="_blank" rel="noopener noreferrer"
                className="text-white/50 hover:text-green-400 transition-colors" aria-label="וואטסאפ">
                <WhatsAppIcon />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Divider + Logo + copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 py-8 flex flex-col items-center gap-4">
          {/* Logo white centered */}
          <Link href="/">
            <Image
              src="https://tiktime.co.il/497865_110.png"
              alt="TikTime"
              width={120}
              height={46}
              className="h-11 w-auto brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
              unoptimized
            />
          </Link>

          {/* Payment badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {["Visa", "Mastercard", "PayPal", "Amex", "Diners"].map((p) => (
              <span key={p} className="bg-white/10 text-white/50 text-[11px] px-2.5 py-1 rounded font-medium">
                {p}
              </span>
            ))}
            <span className="text-white/30 text-[11px] flex items-center gap-1">🔒 SSL</span>
          </div>

          <p className="text-white/30 text-xs">
            © {currentYear} TikTime – כל הזכויות שמורות
          </p>
        </div>
      </div>
    </footer>
  );
}
