import React from "react";
import type { Metadata } from "next";
import { getNewsUseCase, getNewsCategoriesUseCase } from "@/application";
import { NewsListView } from "@/presentation/features/news/news-list-view";

export const metadata: Metadata = {
  title: "ຂ່າວສານ ແລະ ຄວາມເຄື່ອນໄຫວ | ລັດວິສາຫະກິດໄຟຟ້າລາວ (EDL)",
  description:
    "ສູນລວມຂ່າວສານການເຄື່ອນໄຫວ, ໂຄງການພັດທະນາຕາໜ່າງໄຟຟ້າ, ແຈ້ງການ ແລະ ກິດຈະກຳຕ່າງໆ ຂອງ ລັດວິສາຫະກິດໄຟຟ້າລາວ.",
};

export default async function NewsPage() {
  const [articles, categories] = await Promise.all([
    getNewsUseCase(),
    getNewsCategoriesUseCase(),
  ]);

  const categoryNames = [
    "ທັງໝົດ",
    ...(categories.length > 0
      ? categories.map((c) => c.categoryName)
      : Array.from(new Set(articles.map((a) => a.category?.categoryName || "ຂ່າວສານ")))),
  ];

  return <NewsListView articles={articles} categories={categoryNames} />;
}
