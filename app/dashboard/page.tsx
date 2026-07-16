"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import ProposalCard from "@/components/ProposalCard";

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

export default function DashboardPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await fetch("/api/proposals");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Erreur lors du chargement.");
        return;
      }

      setProposals(data.proposals);
    } catch (error) {
      setError("Erreur réseau, vérifiez votre connexion.");
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette proposition ? Cette action est irréversible.")) return;

    setProposals((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch(`/api/proposals/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Erreur suppression:", error);
      fetchProposals();
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📄</span>
          <span className="font-bold text-gray-800">ProposAI</span>
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

      <div className="p-8 max-w-5xl mx-auto flex flex-col gap-6">
        {/* Titre + stats */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Mes propositions
          </h1>
          <span className="text-sm text-gray-400">
            {proposals.length} proposition{proposals.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* États */}
        {isLoading ? (
          <div className="flex items-center justify-center h-40 gap-3 text-gray-400">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-sm">Chargement...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            ⚠️ {error}
          </div>
        ) : proposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-5xl">📄</span>
            <p className="text-gray-500 text-sm">Aucune proposition pour l'instant.</p>
            <Link
              href="/proposals/new"
              className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Créer ma première proposition
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}