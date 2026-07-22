"use client";

import { useState } from "react";

type RenewRequestFormProps = {
  token: string;
  clientName: string;
  onRequested: () => void;
};

export default function RenewRequestForm({
  token,
  clientName,
  onRequested,
}: RenewRequestFormProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleRequest = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/public/proposals/${token}/renew-request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Erreur lors de la demande.");
        return;
      }

      onRequested();
    } catch (error) {
      setError("Erreur réseau, vérifiez votre connexion.");
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
      >
        🔄 Demander une nouvelle proposition
      </button>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col gap-4">
      <h3 className="text-base font-semibold text-blue-700">
        Demander une nouvelle proposition
      </h3>
      <p className="text-sm text-blue-600">
        Votre demande sera envoyée au prestataire qui pourra vous soumettre une nouvelle proposition.
      </p>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-blue-700">
          Message (optionnel)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ex: Pouvez-vous revoir le budget à la baisse? Ou modifier le délai de livraison?"
          className="p-3 border border-blue-200 rounded-xl text-sm text-gray-800 bg-white resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
          maxLength={500}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => setShowForm(false)}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={handleRequest}
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Envoi...
            </>
          ) : (
            "🔄 Envoyer la demande"
          )}
        </button>
      </div>
    </div>
  );
}