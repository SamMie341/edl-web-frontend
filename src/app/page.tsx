import { getHomeDataUseCase } from "@/application";
import {
  HeroSection,
  QuickServicesHub,
  InteractiveBillCalculator,
  NationalGridStats,
  NewsSection,
  ProcurementPreview,
  MagazineShowcase,
  SafetyKnowledgeSection,
} from "@/presentation/features/home";

export default async function Home() {
  const {
    news,
    categories,
    magazines,
    procurements,
    visionMissions,
    electricalKnowledge,
    jobPostings,
  } = await getHomeDataUseCase();

  const categoryNames = categories.map((c) => c.categoryName);

  return (
    <main className="w-full min-h-screen">
      {/* 1. Hero Section with dynamic slides & live energy widgets */}
      <HeroSection />

      {/* 2. Quick Access Services Grid (E-Services) */}
      <QuickServicesHub />

      {/* 3. Interactive Tariff & Bill Calculator (Interactive Engagement Highlight) */}
      <InteractiveBillCalculator />

      {/* 4. National Grid Stats & Corporate Vision from Database */}
      <NationalGridStats visionMissions={visionMissions} />

      {/* 5. Latest News, Announcements & Activities from Database */}
      <NewsSection news={news} categories={categoryNames} />

      {/* 6. Procurements & Job Postings from Database */}
      <ProcurementPreview
        procurements={procurements}
        jobPostings={jobPostings}
      />

      {/* 7. EDL Publications & E-Magazines from Database */}
      <MagazineShowcase magazines={magazines} />

      {/* 8. Electrical Safety & Energy Saving Knowledge from Database */}
      <SafetyKnowledgeSection knowledge={electricalKnowledge} />
    </main>
  );
}
