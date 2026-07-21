import ProposalView from "@/components/ProposalView";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <span className="font-bold text-gray-800">ProposAI</span>
          </div>
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              ← Retour au dashboard
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link
            href="/proposals/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Nouvelle proposition
          </Link>
          <UserButton />
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <ProposalView id={id} />
      </div>
    </main>
  );
}