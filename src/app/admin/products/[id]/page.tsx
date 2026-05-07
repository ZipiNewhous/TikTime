import { notFound } from "next/navigation";
import prisma from "@/lib/db/prisma";
import ProductForm from "../ProductForm";

export const metadata = { title: "עריכת מוצר" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id);

  if (isNaN(productId)) notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      productCategories: { include: { category: true } },
      productTags: { include: { tag: true } },
    },
  });

  if (!product) notFound();

  return (
    <ProductForm
      initialData={{
        id: product.id,
        name: product.name,
        sku: product.sku,
        brandId: product.brandId,
        price: product.price,
        salePrice: product.salePrice,
        description: product.description,
        specs: product.specs,
        stockStatus: product.stockStatus,
        image1: product.image1,
        image2: product.image2,
        image3: product.image3,
        featured: product.featured,
        active: product.active,
        productCategories: product.productCategories.map((pc) => ({
          category: { id: pc.category.id },
        })),
        productTags: product.productTags.map((pt) => ({
          tag: { id: pt.tag.id },
        })),
      }}
    />
  );
}
