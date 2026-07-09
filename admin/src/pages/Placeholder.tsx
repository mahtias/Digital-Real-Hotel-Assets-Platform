// Placeholder for pages still being migrated from frontend admin components
export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
      <p className="text-gray-500 text-sm">This page is being migrated into the admin panel.</p>
    </div>
  );
}
