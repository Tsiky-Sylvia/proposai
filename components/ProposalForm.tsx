"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  title: string;
  rawInput: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  amount: string;
  validUntil: string;
};

export default function ProposalForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    title: "",
    rawInput: "",
    clientName: "",
    clientEmail: "",
    clientCompany: "",
    amount: "",
    validUntil: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isValid =
    form.title.trim() &&
    form.rawInput.trim() &&
    form.clientName.trim() &&
    form.clientEmail.trim() &&
    form.amount.trim();

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }

      //router.push(`/proposals/${data.proposal.id}`);
      router.push(`/dashboard`);
    } catch (error) {
      setError("Erreur réseau, vérifiez votre connexion.");
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
      {/* Titre */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Titre de la proposition <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Ex: Développement site e-commerce Boutique Marie"
          className="p-3 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description brute */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Décris le projet <span className="text-red-500">*</span>
        </label>
        <textarea
          name="rawInput"
          value={form.rawInput}
          onChange={handleChange}
          placeholder="Ex: Site e-commerce pour une boutique de vêtements, stack Next.js + Stripe, livraison en 3 mois, inclus design, dev et formation client..."
          className="p-3 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white resize-none h-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={2000}
        />
        <span className="text-xs text-gray-400 text-right">
          {form.rawInput.length}/2000
        </span>
      </div>

      {/* Informations client */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-gray-700">
          Informations client
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Nom du client <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="clientName"
              value={form.clientName}
              onChange={handleChange}
              placeholder="Ex: Marie Dupont"
              className="p-3 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Email du client <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="clientEmail"
              value={form.clientEmail}
              onChange={handleChange}
              placeholder="Ex: marie@boutique.fr"
              className="p-3 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Entreprise (optionnel)
            </label>
            <input
              type="text"
              name="clientCompany"
              value={form.clientCompany}
              onChange={handleChange}
              placeholder="Ex: Boutique Marie SARL"
              className="p-3 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Montant (€) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Ex: 3500"
              min={0}
              className="p-3 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Valide jusqu'au (optionnel)
          </label>
          <input
            type="date"
            name="validUntil"
            value={form.validUntil}
            onChange={handleChange}
            className="p-3 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          ⚠️ {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading || !isValid}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Génération en cours...
          </>
        ) : (
          "✨ Générer la proposition"
        )}
      </button>
    </div>
  );
}