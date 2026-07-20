"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import ProposalCard from "@/components/ProposalCard";
import DashboardStats from "@/components/DashboardStats";

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

type Stats = {
  total: number;
  totalAmount: number;
  accepted: number;
  pending: number;
  declined: number;
  acceptedAmount: number;
};

const STATUS_FILTERS = [
  { key: "ALL", label: "Toutes" },
  { key: "DRAFT", label: "Brouillon" },
  { key: "SENT", label: "Envoyées" },
  { key: "VIEWED", label: "Consultées" },
  { key: "ACCEPTED", label: "Acceptées" },
  { key: "DECLINED", label: "Refusées" },
  { key: "EXPIRED", label: "Expirées" },
];

export default function DashboardPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [search, setSearch] = useState("");

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
      setStats(data.stats);
    } catch (error) {
      setError("Erreur réseau, vérifiez votre connexion.");
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette proposition ? Cette action est irréversible."))
      return;

    setProposals((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch(`/api/proposals/${id}`, { method: "DELETE" });
      fetchProposals(); // Rafraîchir les stats
    } catch (error) {
      console.error("Erreur suppression:", error);
      fetchProposals();
    }
  };

  // Filtrage et recherche côté client
  const filteredProposals = proposals
    .filter((p) => activeFilter === "ALL" || p.status === activeFilter)
    .filter(
      (p) =>
        search.trim() === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.clientName.toLowerCase().includes(search.toLowerCase())
    );

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

      <div className="p-8 max-w-6xl mx-auto flex flex-col gap-6">
        {/* Stats */}
        {stats && <DashboardStats stats={stats} />}

        {/* Titre + recherche */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Mes propositions
          </h1>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre ou client..."
            className="p-3 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-72"
          />
        </div>

        {/* Filtres par statut */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeFilter === filter.key
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {filter.label}
              {filter.key !== "ALL" && (
                <span className="ml-1 text-xs opacity-70">
                  ({proposals.filter((p) => p.status === filter.key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Liste */}
        {isLoading ? (
          <div className="flex items-center justify-center h-40 gap-3 text-gray-400">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-sm">Chargement...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            ⚠️ {error}
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-5xl">
              {search || activeFilter !== "ALL" ? "🔍" : "📄"}
            </span>
            <p className="text-gray-500 text-sm">
              {search || activeFilter !== "ALL"
                ? "Aucune proposition ne correspond à votre recherche."
                : "Aucune proposition pour l'instant."}
            </p>
            {!search && activeFilter === "ALL" && (
              <Link
                href="/proposals/new"
                className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Créer ma première proposition
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProposals.map((proposal) => (
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