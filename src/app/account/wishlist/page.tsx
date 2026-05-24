import { SimpleContentPage } from "@/components/woven-client";

export const metadata = {
  title: "Wishlist | Woven",
  description: "Your saved Woven items.",
};

export default function Page() {
  return <SimpleContentPage type="account" />;
}
