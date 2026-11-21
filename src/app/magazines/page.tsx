import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getMagazinesUseCase } from "@/application";
import { MagazinesListView } from "@/presentation/features/magazines";
import MagazinesLoading from "./loading";

export const metadata: Metadata = {
  title: "ວາລະສານ ໄຟຟ້າລາວ (E-Magazine) | ລັດວິສາຫະກິດໄຟຟ້າລາວ (EDL)",
  description:
    "ສູນລວມວາລະສານດິຈິຕອນ (E-Magazine) ແລະ ສິ່ງພິມທາງການຂອງ ລັດວິສາຫະກິດໄຟຟ້າລາວ. ອ່ານອອນລາຍ ແລະ ດາວໂຫຼດ PDF ຟຣີທຸກສະບັບ.",
};

async function MagazinesContent() {
  const allMagazines = await getMagazinesUseCase();
  const visibleMagazines = allMagazines.filter(
    (mag) => mag.status !== "INACTIVE" && mag.status !== "DRAFT"
  );

  return <MagazinesListView magazines={visibleMagazines} />;
}

export default function MagazinesPage() {
  return (
    <Suspense fallback={<MagazinesLoading />}>
      <MagazinesContent />
    </Suspense>
  );
}
