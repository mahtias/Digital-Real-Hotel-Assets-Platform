// Placeholder for pages still being migrated from frontend admin components
import { PageHeader } from "../components/ui";

export default function Placeholder({ title }: { title: string }) {
  return (
    <>
      <PageHeader title={title} />
      <div className="card card-body text-sm text-medium-emphasis">This page is being migrated into the admin panel.</div>
    </>
  );
}
