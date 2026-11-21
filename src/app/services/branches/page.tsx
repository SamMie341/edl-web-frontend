import React from "react";
import type { Metadata } from "next";
import { getBranchDisplaysUseCase } from "@/application";
import { BranchesListView } from "@/presentation/features/branches/branches-list-view";

export const metadata: Metadata = {
  title: "ສາຂາ ແລະ ສູນບໍລິການ 18 ແຂວງ ທົ່ວປະເທດ | ລັດວິສາຫະກິດໄຟຟ້າລາວ (EDL)",
  description:
    "ຄົ້ນຫາທີ່ຕັ້ງ, ເບີໂທລະສັບຕິດຕໍ່ ແລະ ຂໍ້ມູນສາຂາ ລັດວິສາຫະກິດໄຟຟ້າລາວ ທົ່ວປະເທດ 18 ແຂວງ ພ້ອມສາຍດ່ວນແຈ້ງເຫດໄຟຟ້າຂັດຂ້ອງ 1199 (24 ຊົ່ວໂມງ).",
};

export default async function BranchesPage() {
  const branchList = await getBranchDisplaysUseCase();

  return <BranchesListView branches={branchList} />;
}
