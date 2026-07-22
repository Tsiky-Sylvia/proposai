import ProposalForm from "@/components/ProposalForm";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function NewProposalPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white justify-between border-b border-gray-100 px-6 py-4 flex gap-3">
        {/* Ligne 1 — Logo + Retour dashboard */}
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

        {/* Ligne 2 — UserButton */}
        <div className="flex flex-col-reverse items-end justify-between gap-4 md:flex-row md:justify-between md:items-center">
          <UserButton/>
        </div>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Nouvelle proposition
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Décris ton projet, l'IA génère une proposition professionnelle en 30 secondes.
          </p>
        </div>
        <ProposalForm />
      </div>
    </main>
  );
}