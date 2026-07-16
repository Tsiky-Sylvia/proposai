import Link from "next/link";

type Proposal = {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string | null;
  amount: number;
  currency: string;
  status: string;
  validUntil: string | null;
  createdAt: string;
};

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-600" },
  SENT: { label: "Envoyée", color: "bg-blue-100 text-blue-600" },
  VIEWED: { label: "Consultée", color: "bg-yellow-100 text-yellow-600" },
  ACCEPTED: { label: "Acceptée", color: "bg-green-100 text-green-600" },
  DECLINED: { label: "Refusée", color: "bg-red-100 text-red-600" },
  EXPIRED: { label: "Expirée", color: "bg-orange-100 text-orange-600" },
};

type ProposalCardProps = {
  proposal: Proposal;
  onDelete: (id: string) => void;
};

export default function ProposalCard({ proposal, onDelete }: ProposalCardProps) {
  const status = statusConfig[proposal.status];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-gray-800 text-base">
            {proposal.title}
          </h3>
          <p className="text-sm text-gray-500">
            {proposal.clientName}
            {proposal.clientCompany ? ` — ${proposal.clientCompany}` : ""}
          </p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Montant + date */}
      <div className="flex gap-4 text-sm text-gray-500">
        <span className="font-semibold text-blue-600">
          {proposal.amount.toLocaleString("fr-FR")} {proposal.currency}
        </span>
        <span>
          Créée le {new Date(proposal.createdAt).toLocaleDateString("fr-FR")}
        </span>
        {proposal.validUntil && (
          <span>
            Valide jusqu'au{" "}
            {new Date(proposal.validUntil).toLocaleDateString("fr-FR")}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <button
          onClick={() => onDelete(proposal.id)}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          ✕ Supprimer
        </button>
        <Link
          href={`/proposals/${proposal.id}`}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Voir la proposition →
        </Link>
      </div>
    </div>
  );
}