"use client"; 

import { useEffect, useState } from "react";

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
    context: string;
    deliverables: string;
    timeline: string;
    pricing: string;
    conditions: string;
    createdAt: string;
    signedAt: string | null;
    signatureData: string | null;
}

function Section ({ title, content } : { title: string; content: string }){
    return(
        <div className="flex felx-col gap-3">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">
                {title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {content}
            </p>
        </div>
    )
}

export default function PublicProposalView({ token }: { token: string }) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await fetch(`/api/public/proposals/${token}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error ?? "Erreur lors du chargement.");
          return;
        }

        setProposal(data.proposal);
      } catch (error) {
        setError("Erreur réseau, vérifiez votre connexion.");
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposal();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 gap-3 text-gray-400">
        <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-sm">Chargement de la proposition...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-60 gap-4">
        <span className="text-5xl">😕</span>
        <p className="text-gray-500 text-sm text-center">{error}</p>
      </div>
    );
  }

  if (!proposal) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📄</span>
          <span className="font-bold text-gray-800 text-lg">ProposAI</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {proposal.title}
        </h1>
        <p className="text-sm text-gray-500">
          Proposition préparée pour {proposal.clientName}
          {proposal.clientCompany ? ` — ${proposal.clientCompany}` : ""}
        </p>
      </div>

      {/* Infos client + montant */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Destinataire
          </h3>
          <p className="font-semibold text-gray-800">{proposal.clientName}</p>
          {proposal.clientCompany && (
            <p className="text-sm text-gray-500">{proposal.clientCompany}</p>
          )}
          <p className="text-sm text-gray-500">{proposal.clientEmail}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Montant
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {proposal.amount.toLocaleString("fr-FR")} {proposal.currency}
          </p>
          {proposal.validUntil && (
            <p className="text-sm text-gray-500">
              Valide jusqu'au{" "}
              {new Date(proposal.validUntil).toLocaleDateString("fr-FR")}
            </p>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6">
        <Section title="📋 Contexte du projet" content={proposal.context} />
        <Section title="📦 Livrables" content={proposal.deliverables} />
        <Section title="🗓 Planning" content={proposal.timeline} />
        <Section title="💰 Tarification" content={proposal.pricing} />
        <Section title="📜 Conditions générales" content={proposal.conditions} />
      </div>

      {/* Zone signature — sera complétée au Jour 9 */}
      {proposal.status === "ACCEPTED" ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <span className="text-3xl">✅</span>
          <p className="font-semibold text-green-700 mt-2">
            Proposition acceptée par {proposal.signatureData}
          </p>
          <p className="text-sm text-green-600 mt-1">
            Signée le{" "}
            {proposal.signedAt
              ? new Date(proposal.signedAt).toLocaleDateString("fr-FR")
              : ""}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center text-gray-400">
          <p className="text-sm">Zone de signature — disponible bientôt</p>
        </div>
      )}

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 pb-4">
        Généré avec ProposAI — proposition n°{proposal.id.slice(0, 8)}
      </p>
    </div>
  );
}