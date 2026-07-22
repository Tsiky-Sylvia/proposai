"use client";

import { useState } from "react";

type DeclineFormProps = {
  token: string;
  onDeclined: () => void;
};

export default function DeclineForm({ token, onDeclined }: DeclineFormProps) {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDecline = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/public/proposals/${token}/decline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Erreur lors du refus.");
        return;
      }

      onDeclined();
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
        className="text-sm text-gray-400 hover:text-red-500 transition-colors underline"
      >
        Refuser la proposition
      </button>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col gap-4">
      <h3 className="text-base font-semibold text-red-700">
        Refuser la proposition
      </h3>
      <p className="text-sm text-red-600">
        Vous êtes sur le point de refuser cette proposition. Le prestataire sera notifié.
      </p>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-red-700">
          Motif du refus (optionnel)
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ex: Budget trop élevé, délai non compatible..."
          className="p-3 border border-red-200 rounded-xl text-sm text-gray-800 bg-white resize-none h-24 focus:outline-none focus:ring-2 focus:ring-red-400"
          maxLength={500}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded-xl text-red-600 text-sm">
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
          onClick={handleDecline}
          disabled={isLoading}
          className="px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Envoi...
            </>
          ) : (
            "❌ Confirmer le refus"
          )}
        </button>
      </div>
    </div>
  );
}