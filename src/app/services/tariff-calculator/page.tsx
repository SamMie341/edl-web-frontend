import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getCalculatorConfigUseCase } from "@/application";
import { CalculatorView } from "@/presentation/features/calculator";
import TariffCalculatorLoading from "./loading";

export const metadata: Metadata = {
  title: "ໂປຣແກຣມຄຳນວນຄ່າໄຟຟ້າ ແລະ ແຜນປະຢັດໄຟ | ລັດວິສາຫະກິດໄຟຟ້າລາວ (EDL)",
  description:
    "ໂປຣແກຣມຈຳລອງຄິດໄລ່ຄ່າກະແສໄຟຟ້າ 8 ຂັ້ນບັນໄດ ຕາມໂຄງສ້າງລາຄາທາງການຂອງ ລັດວິສາຫະກິດໄຟຟ້າລາວ (ແຈ້ງການ 1916/ຟຟລ.ຝທຜ), ພ້ອມນະໂຍບາຍຫຼຸດ 5% ລະດູຮ້ອນ, ອາກອນມູນຄ່າເພີ່ມ 10%, ແລະ ແຜນປະຢັດໄຟ.",
};

async function CalculatorContent() {
  let config = undefined;
  let initialError: string | null = null;
  try {
    config = await getCalculatorConfigUseCase();
  } catch (err: any) {
    if (
      err?.digest === "NEXT_PRERENDER_INTERRUPTED" ||
      err?.digest === "HANGING_PROMISE_REJECTION"
    ) {
      throw err;
    }
    console.error("Failed to fetch calculator config from backend API:", err);
    initialError =
      err?.message || "ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບຖານຂໍ້ມູນ API ໄດ້";
  }
  return <CalculatorView initialConfig={config} initialError={initialError} />;
}

export default function TariffCalculatorPage() {
  return (
    <Suspense fallback={<TariffCalculatorLoading />}>
      <CalculatorContent />
    </Suspense>
  );
}
