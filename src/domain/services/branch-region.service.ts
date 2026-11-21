import { Branch, BranchDisplay, RegionType } from "../entities/branch.entity";

export const HEADQUARTERS_BRANCH: BranchDisplay = {
  id: 0,
  name: "ສຳນັກງານໃຫຍ່ ລັດວິສາຫະກິດໄຟຟ້າລາວ (Headquarters)",
  province: "ນະຄອນຫຼວງວຽງຈັນ",
  region: "central",
  address:
    "ຖະໜົນມິດຕະພາບ ລາວ-ໄທ, ບ້ານທົ່ງກາງ, ເມືອງສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ",
  phone: "(+856-21) 316120, 316121",
  email: "contact@edl.com.la",
  hotline: "1199",
  hours: "08:00 - 16:00 (ຈັນ - ສຸກ)",
  isHeadquarters: true,
  image: "/uploads/branches/svc-178aad55-f168-465e-9070-dd4e785ac6ee.png",
  branchImage: "/uploads/branches/svc-178aad55-f168-465e-9070-dd4e785ac6ee.png",
};

/**
 * Categorizes a branch into North, Central, or South region based on name or address keywords.
 */
export function getBranchRegion(
  branchName: string,
  address?: string | null
): RegionType {
  const text = (branchName + " " + (address || "")).toLowerCase();
  if (
    text.includes("ຜົ້ງສາລີ") ||
    text.includes("ໄຊຍະບູລີ") ||
    text.includes("ອຸດົມໄຊ") ||
    text.includes("ຫຼວງນ້ຳທາ") ||
    text.includes("ບໍ່ແກ້ວ") ||
    text.includes("ຫົວພັນ") ||
    text.includes("ຫຼວງພະບາງ")
  ) {
    return "north";
  }
  if (
    text.includes("ສາລະວັນ") ||
    text.includes("ເຊກອງ") ||
    text.includes("ຈຳປາສັກ") ||
    text.includes("ອັດຕະປື") ||
    text.includes("ຈໍາປາສັກ")
  ) {
    return "south";
  }
  return "central";
}

/**
 * Formats Lao province name from branch title.
 */
export function getProvinceName(name: string): string {
  if (name.includes("ນະຄອນຫຼວງ")) return "ນະຄອນຫຼວງວຽງຈັນ";
  const cleaned = name.replace("ສາຂາ ແຂວງ", "ແຂວງ ").replace("ສາຂາ ", "");
  return cleaned.trim();
}

/**
 * Transforms raw Branch entity to presentation-ready BranchDisplay model.
 */
export function mapBranchToDisplay(b: Branch): BranchDisplay {
  const image = b.coverImage || b.branchImage || null;
  return {
    id: b.id,
    name: b.branchName,
    province: getProvinceName(b.branchName),
    region: getBranchRegion(b.branchName, b.address),
    address: b.address || "ສຳນັກງານສາຂາ ປະຈຳແຂວງ",
    phone: b.phoneNumber || "1199",
    email: b.email || undefined,
    hotline: "1199",
    hours: "08:00 - 16:00 (ສູນສຸກເສີນ 24/7)",
    image,
    coverImage: b.coverImage || null,
    branchImage: b.branchImage || null,
  };
}
