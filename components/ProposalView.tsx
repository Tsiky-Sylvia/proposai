"use client";

import { useEffect, useState } from "react";
import ProposalTimeline from "@/components/ProposalTimeline";
import type { ProposalEvent, Proposal } from "@/lib/type";

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-600" },
  SENT: { label: "Envoyée", color: "bg-blue-100 text-blue-600" },
  VIEWED: { label: "Consultée", color: "bg-yellow-100 text-yellow-600" },
  ACCEPTED: { label: "Acceptée", color: "bg-green-100 text-green-600" },
  DECLINED: { label: "Refusée", color: "bg-red-100 text-red-600" },
  EXPIRED: { label: "Expirée", color: "bg-orange-100 text-orange-600" },
};

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}

export default function ProposalView({ id }: { id: string }) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  // Ajoute ces states en haut du composant
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);


  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await fetch(`/api/proposals/${id}`);
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
    
  }, [id]);

  // Rafraîchissement automatique si statut en attente
useEffect(() => {
  if (!proposal) return;
  if (["ACCEPTED", "DECLINED", "EXPIRED", "DRAFT"].includes(proposal.status)) return;

  const interval = setInterval(async () => {
    try {
      const response = await fetch(`/api/proposals/${id}`);
      const data = await response.json();
      if (response.ok) {
        setProposal(data.proposal);
      }
    } catch (error) {
      console.error("Erreur rafraîchissement:", error);
    }
  }, 30000); // 30 secondes

  return () => clearInterval(interval);
}, [proposal?.status, id]);

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
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
        ⚠️ {error}
      </div>
    );
  }

  if (!proposal) return null;

  const status = statusConfig[proposal.status];

  const handleSend = async () => {
    if (!proposal) return;
    setIsSending(true);
    setSendError(null);

    try {
      const response = await fetch(`/api/proposals/${proposal.id}/send`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        setSendError(data.error ?? "Erreur lors de l'envoi.");
        return;
      }

      setSent(true);
      setProposal((prev) => prev ? { ...prev, status: "SENT" } : prev);
    } catch (error) {
      setSendError("Erreur réseau, vérifiez votre connexion.");
      console.error("Erreur:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main>
      <div className="flex flex-col gap-6">
        {/* Header */}
        {["SENT", "VIEWED"].includes(proposal.status) && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Suivi en direct
          </div>
        )}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{proposal.title}</h1>
            <p className="text-sm text-gray-400 mt-1">
              Créée le {new Date(proposal.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>

        {/* Infos client + montant */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Client
            </h3>
            <p className="font-semibold text-gray-800">{proposal.clientName}</p>
            {proposal.clientCompany && (
              <p className="text-sm text-gray-500">{proposal.clientCompany}</p>
            )}
            <p className="text-sm text-gray-500">{proposal.clientEmail}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
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

        {/* Contenu généré par l'IA */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6">
          <Section title="📋 Contexte du projet" content={proposal.context} />
          <Section title="📦 Livrables" content={proposal.deliverables} />
          <Section title="🗓 Planning" content={proposal.timeline} />
          <Section title="💰 Tarification" content={proposal.pricing} />
          <Section title="📜 Conditions générales" content={proposal.conditions} />
        </div>

        {proposal.events && proposal.events.length > 0 && (
          <ProposalTimeline events={proposal.events} />
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={async () => {
              const response = await fetch(`/api/proposals/${proposal.id}/pdf`);
              if (!response.ok) {
                alert("Erreur lors de la génération du PDF.");
                return;
              }
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `proposition-${proposal.id}.pdf`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            📄 Exporter en PDF
          </button>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-3">
              {sendError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  ⚠️ {sendError}
                </div>
              )}
              {sent && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                  ✅ Email envoyé à {proposal.clientEmail}
                </div>
              )}
              <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <span className="text-xs text-gray-500 flex-1 truncate">
                  {`${window.location.origin}/p/${proposal.publicToken}`}
                </span>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      `${window.location.origin}/p/${proposal.publicToken}`
                    );
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium shrink-0 transition-colors"
                >
                  {copied ? "✅ Copié !" : "📋 Copier"}
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={isSending || sent || proposal.status === "ACCEPTED"}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : sent ? (
                  "✅ Envoyé"
                ) : (
                  "📤 Envoyer au client"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}