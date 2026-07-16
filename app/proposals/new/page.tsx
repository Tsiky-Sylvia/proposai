import ProposalForm from "@/components/ProposalForm";
import { UserButton } from "@clerk/nextjs";

export default function NewProposalPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📄</span>
          <span className="font-bold text-gray-800">ProposAI</span>
        </div>
        <div className="flex items-center gap-4">
          <UserButton />
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