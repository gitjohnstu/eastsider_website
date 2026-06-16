import { notFound } from "next/navigation";
import { getCity } from "@/config/city";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface CityLayoutProps {
  children: React.ReactNode;
  params: Promise<{ city: string }>;
}

export default async function CityLayout({ children, params }: CityLayoutProps) {
  const { city } = await params;
  const cityConfig = getCity(city);
  if (!cityConfig) notFound();

  const { theme } = cityConfig;

  return (
    <>
      <style>{`
        :root {
          --background: ${theme.mastheadBg};
          --gold: ${theme.accent};
          --gold-hover: ${theme.accent}cc;
          --border-subtle: ${theme.border};
        }
        body { background: ${theme.mastheadBg}; }
      `}</style>
      <Header
        citySlug={cityConfig.slug}
        cityName={cityConfig.name}
        cityState={cityConfig.state}
        headerBg={theme.headerBg}
        navGroupKeys={cityConfig.navGroupKeys}
      />
      <main className="flex-1">{children}</main>
      <Footer citySlug={cityConfig.slug} cityName={cityConfig.name} cityState={cityConfig.state} />
    </>
  );
}
