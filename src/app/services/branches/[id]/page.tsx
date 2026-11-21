import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getBranchesUseCase,
  getBranchByIdUseCase,
  getServiceCentersUseCase,
} from "@/application";
import { getBranchRegion } from "@/domain";
import { BranchDetailView } from "@/presentation/features/branches/branch-detail-view";
import BranchDetailLoading from "./loading";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const branches = await getBranchesUseCase();
  return branches.map((b) => ({
    id: b.id.toString(),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const branch = await getBranchByIdUseCase(id);

  if (!branch) {
    return {
      title: "ບໍ່ພົບຂໍ້ມູນສາຂາ | ລັດວິສາຫະກິດໄຟຟ້າລາວ",
    };
  }

  return {
    title: `${branch.branchName} | ສາຂາ ລັດວິສາຫະກິດໄຟຟ້າລາວ (EDL)`,
    description: `ຂໍ້ມູນທີ່ຕັ້ງ, ເບີໂທລະສັບຕິດຕໍ່, ຫ້ອງການໄຟຟ້າເມືອງ ແລະ ພາລະບົດບາດຂອງ ${branch.branchName} ລັດວິສາຫະກິດໄຟຟ້າລາວ.`,
  };
}

async function BranchDetailContent({ params }: PageProps) {
  const { id } = await params;

  const [branch, allBranches, allServiceCenters] = await Promise.all([
    getBranchByIdUseCase(id),
    getBranchesUseCase(),
    getServiceCentersUseCase(),
  ]);

  if (!branch) {
    notFound();
  }

  // Filter sub-service centers belonging to this branch
  const branchServiceCenters = allServiceCenters.filter(
    (c) => c.branchId === branch.id
  );

  // Get other branches for sidebar recommendations
  const otherBranches = allBranches
    .filter((b) => b.id !== branch.id)
    .slice(0, 5);

  const regionCode = getBranchRegion(branch.branchName, branch.address);
  const regionName =
    regionCode === "north"
      ? "ພາກເໜືອ"
      : regionCode === "south"
      ? "ພາກໃຕ້"
      : "ພາກກາງ";

  return (
    <BranchDetailView
      branch={branch}
      serviceCenters={branchServiceCenters}
      otherBranches={otherBranches}
      regionName={regionName}
    />
  );
}

export default function BranchDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<BranchDetailLoading />}>
      <BranchDetailContent params={params} />
    </Suspense>
  );
}
