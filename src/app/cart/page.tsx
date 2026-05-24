import { SimpleContentPage } from "@/components/woven-client";

export const metadata = {
  title: "Cart | Woven",
  description: "Review your Woven cart.",
};

export default function Page() {
  return <SimpleContentPage type="cart" />;
}
