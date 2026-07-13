import ProposalForm from "@/components/ProposalForm";

export default function NewProposalPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
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