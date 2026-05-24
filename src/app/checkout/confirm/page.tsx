import { SimpleContentPage } from "@/components/woven-client";

export const metadata = {
  title: "Confirm Order | Woven",
  description: "Confirm your Woven order.",
};

export default function Page() {
  return <SimpleContentPage type="checkout" />;
}
