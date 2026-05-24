import { SimpleContentPage } from "@/components/woven-client";

export const metadata = {
  title: "Payment | Woven",
  description: "Select a Woven payment method.",
};

export default function Page() {
  return <SimpleContentPage type="checkout" />;
}
