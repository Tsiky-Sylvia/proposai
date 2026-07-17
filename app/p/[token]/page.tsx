import PublicProposalView from "@/components/PublicProposalView";

export default async function PublicProposalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <PublicProposalView token={token} />
      </div>
    </main>
  );
}