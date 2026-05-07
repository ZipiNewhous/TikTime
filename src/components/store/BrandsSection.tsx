import Link from "next/link";

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  _count: { products: number };
}

interface BrandsSectionProps {
  brands: Brand[];
}

export default function BrandsSection({ brands }: BrandsSectionProps) {
  return (
    <section className="py-16 bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="section-title">המותגים שלנו</h2>
          <p className="section-subtitle">
            אנו מציעים את המותגים המובילים בעולם שעוני היוקרה
          </p>
          <div className="section-divider" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="
                flex flex-col items-center justify-center
                bg-gray-50 hover:bg-[#c9a96e]/10
                border border-gray-100 hover:border-[#c9a96e]
                rounded-xl p-4 gap-2
                transition-all duration-200 group
              "
            >
              {brand.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-10 w-full object-contain grayscale group-hover:grayscale-0 transition-all"
                />
              ) : (
                <div className="h-10 flex items-center justify-center">
                  <span className="font-black text-sm text-gray-700 group-hover:text-[#c9a96e] transition-colors text-center">
                    {brand.name}
                  </span>
                </div>
              )}
              <span className="text-xs text-gray-400">{brand._count.products} שעונים</span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/brands" className="btn-outline inline-flex">
            כל המותגים
          </Link>
        </div>
      </div>
    </section>
  );
}
