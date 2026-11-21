import type { Metadata } from "next";
import "./globals.css";
import { Navbar, Footer } from "@/presentation";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.edl.com.la"
  ),
  title: "ລັດວິສາຫະກິດໄຟຟ້າລາວ | Electricité du Laos (EDL)",
  description:
    "ເວັບໄຊຫຼັກທາງການ ລັດວິສາຫະກິດໄຟຟ້າລາວ (Electricite du Laos - EDL) - ພະລັງງານໄຟຟ້າ ເພື່ອການພັດທະນາ ເສດຖະກິດ-ສັງຄົມ ແຫ່ງ ສປປ ລາວ. ກວດສອບ ແລະ ຄຳນວນຄ່າໄຟຟ້າ, ຂ່າວສານ, ວາລະສານ ແລະ ສູນບໍລິການ 18 ແຂວງ.",
  keywords: [
    "EDL",
    "ໄຟຟ້າລາວ",
    "Electricite du Laos",
    "ຄຳນວນຄ່າໄຟຟ້າ",
    "ອັດຕາຄ່າໄຟຟ້າ",
    "ສາຍດ່ວນ 1199",
    "ພະລັງງານສະອາດ",
    "ວາລະສານ ຟຟລ",
  ],
  icons: {
    icon: "/edl-logo-v2.png",
    apple: "/edl-logo-v2.png",
  },
  openGraph: {
    title: "ລັດວິສາຫະກິດໄຟຟ້າລາວ | Electricité du Laos (EDL)",
    description: "ພະລັງງານໄຟຟ້າ ເພື່ອການພັດທະນາ ເສດຖະກິດ-ສັງຄົມ ແຫ່ງ ສປປ ລາວ",
    url: "https://www.edl.com.la",
    siteName: "Electricite du Laos",
    images: [
      {
        url: "/edl-logo-v2.png",
        width: 800,
        height: 800,
        alt: "Electricite du Laos Logo",
      },
    ],
    locale: "lo_LA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="lo"
      className="h-full scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-[#2329c1] selection:text-white"
        suppressHydrationWarning
      >
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
