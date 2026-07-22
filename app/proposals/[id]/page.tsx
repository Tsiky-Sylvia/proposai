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
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white justify-between border-b border-gray-100 px-6 py-4 flex gap-3">
        {/* Ligne 1 — Logo + retour dashboard */}
        <div className="flex flex-col justify-between items-start gap-4 md:flex-row md:justify-between md:items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <span className="font-bold text-gray-800">ProposAI</span>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            ← Retour au dashboard
          </Link>
        </div>

        {/* Ligne 2 — Nouvelle proposition + userbutton */}
        <div className="flex flex-col items-end gap-4 md:flex-row md:items-center">
          <div className="md:ml-auto order-1 md:order-2">
            <UserButton />
          </div>

          <Link
            href="/proposals/new"
            className="order-2 md:order-1 inline-flex w-fit whitespace-nowrap rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Nouvelle proposition
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <ProposalView id={id} />
      </div>
    </main>
  );
}