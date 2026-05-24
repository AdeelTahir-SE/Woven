import { notFound } from "next/navigation";
import { ThemeExperience } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";
import { fallbackCatalog, getThemeFromCatalog, type ThemeId } from "@/lib/woven-data";

export function generateStaticParams() {
  return fallbackCatalog.themes.map((theme) => ({ theme: theme.id }));
}

export async function generateMetadata(props: PageProps<"/themes/[theme]">) {
  const { theme } = await props.params;
  const activeTheme = getThemeFromCatalog(await getCatalogData(), theme);

  if (!activeTheme) {
    return { title: "Theme Not Found | Woven" };
  }

  return {
    title: `${activeTheme.label} | Woven`,
    description: activeTheme.tagline,
  };
}

export default async function ThemePage(props: PageProps<"/themes/[theme]">) {
  const { theme } = await props.params;
  const catalog = await getCatalogData();
  const activeTheme = getThemeFromCatalog(catalog, theme);

  if (!activeTheme) {
    notFound();
  }

  return <ThemeExperience catalog={catalog} themeId={activeTheme.id as ThemeId} />;
}
