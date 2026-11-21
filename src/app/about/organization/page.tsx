import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getOrgStructuresUseCase } from "@/application";
import { OrganizationView } from "@/presentation/features/organization";
import OrganizationLoading from "./loading";

export const metadata: Metadata = {
  title: "ໂຄງຮ່າງການຈັດຕັ້ງ | ລັດວິສາຫະກິດໄຟຟ້າລາວ (EDL)",
  description:
    "ໂຄງຮ່າງການຈັດຕັ້ງ ສະພາຜູ້ອຳນວຍການ, ຄະນະຜູ້ບໍລິຫານ ແລະ ແຜນຜັງລວມ ລັດວິສາຫະກິດໄຟຟ້າລາວ ແຫ່ງ ສປປ ລາວ.",
};

async function OrganizationContent() {
  const structures = await getOrgStructuresUseCase();
  return <OrganizationView structures={structures} />;
}

export default function OrganizationPage() {
  return (
    <Suspense fallback={<OrganizationLoading />}>
      <OrganizationContent />
    </Suspense>
  );
}
