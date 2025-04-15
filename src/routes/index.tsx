// /routes/index.tsx
import Listings from "~/components/Listings";
import Layout from "~/components/Layout";

export default function IndexPage() {
  return (
    <Layout>
    <div>
      <Listings />
    </div>
    </Layout>
  );
}
