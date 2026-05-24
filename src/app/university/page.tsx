import { redirect } from "next/navigation";

export const metadata = {
  title: "Themes | Woven",
  description: "Explore Woven themes.",
};

export default function Page() {
  redirect("/themes/classic");
}
