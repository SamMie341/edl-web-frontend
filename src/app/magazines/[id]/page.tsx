import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMagazinesUseCase, getMagazineByIdUseCase } from "@/application";
import { getStorageUrl } from "@/infrastructure";
import { MagazineDetailView } from "@/presentation/features/magazines";
import MagazineDetailLoading from "./loading";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const magazine = await getMagazineByIdUseCase(id);

  if (!magazine) {
    return {
      title: "ບໍ່ພົບວາລະສານ | ລັດວິສາຫະກິດໄຟຟ້າລາວ (EDL)",
    };
  }

  const coverUrl = magazine.coverImage
    ? getStorageUrl(magazine.coverImage)
    : "/edl-logo-v2.png";

  return {
    title: `${magazine.title} | ວາລະສານ ຟຟລ (EDL)`,
    description:
      magazine.description ||
      `ອ່ານອອນລາຍ ແລະ ດາວໂຫຼດ ${magazine.title} (${magazine.issueNumber || "E-Magazine"}) ຈາກລັດວິສາຫະກິດໄຟຟ້າລາວ.`,
    openGraph: {
      title: `${magazine.title} | ວາລະສານ ຟຟລ`,
      description:
        magazine.description ||
        `ວາລະສານ ໄຟຟ້າລາວ ${magazine.issueNumber || ""}`.trim(),
      images: [
        {
          url: coverUrl,
          width: 800,
          height: 1067,
          alt: magazine.title,
        },
      ],
      type: "article",
    },
  };
}

async function MagazineDetailContent({ params }: PageProps) {
  const { id } = await params;
  const [magazine, allMagazines] = await Promise.all([
    getMagazineByIdUseCase(id),
    getMagazinesUseCase(),
  ]);

  if (!magazine) {
    notFound();
  }

  const otherMagazines = allMagazines
    .filter(
      (item) =>
        item.id !== magazine.id &&
        item.status !== "INACTIVE" &&
        item.status !== "DRAFT"
    )
    .slice(0, 3);

  return (
    <MagazineDetailView magazine={magazine} otherMagazines={otherMagazines} />
  );
}

export default function MagazineDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<MagazineDetailLoading />}>
      <MagazineDetailContent params={params} />
    </Suspense>
  );
}
