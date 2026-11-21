import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNewsUseCase, getNewsByIdUseCase } from "@/application";
import { NewsDetailView } from "@/presentation/features/news/news-detail-view";
import NewsDetailLoading from "./loading";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const articles = await getNewsUseCase();
  return articles.map((article) => ({
    id: article.id.toString(),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const news = await getNewsByIdUseCase(id);

  if (!news) {
    return {
      title: "ບໍ່ພົບຂ່າວສານ | ລັດວິສາຫະກິດໄຟຟ້າລາວ",
    };
  }

  const title = news.titleLa || news.title || "ຂ່າວສານ";

  return {
    title: `${title} | ຂ່າວສານ ຟຟລ`,
    description: news.excerpt,
    openGraph: {
      title: `${title} | ຂ່າວສານ ຟຟລ`,
      description: news.excerpt,
      images: [
        {
          url: news.coverImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "article",
    },
  };
}

async function NewsDetailContent({ params }: PageProps) {
  const { id } = await params;
  const [news, allNews] = await Promise.all([
    getNewsByIdUseCase(id),
    getNewsUseCase(),
  ]);

  if (!news) {
    notFound();
  }

  const relatedArticles = allNews
    .filter((item) => item.id !== news.id)
    .slice(0, 3);

  return <NewsDetailView news={news} relatedArticles={relatedArticles} />;
}

export default function NewsDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<NewsDetailLoading />}>
      <NewsDetailContent params={params} />
    </Suspense>
  );
}
