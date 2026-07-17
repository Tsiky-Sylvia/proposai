"use client";

import { useState } from "react";

type SignatureFormProps = {
  token: string;
  clientName: string;
  amount: number;
  currency: string;
  onSigned: (signatureData: string, signedAt: string) => void;
};

export default function SignatureForm({
  token,
  clientName,
  amount,
  currency,
  onSigned,
}: SignatureFormProps) {
  const [fullName, setFullName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = fullName.trim().length > 2 && agreed;

  const handleSign = async () => {
    if (!isValid) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/public/proposals/${token}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Erreur lors de la signature.");
        return;
      }

      onSigned(fullName, data.signedAt);
    } catch (error) {
      setError("Erreur réseau, vérifiez votre connexion.");
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-800">
          Accepter la proposition
        </h3>
        <p className="text-sm text-gray-500">
          En signant, vous acceptez la proposition commerciale d'un montant de{" "}
          <span className="font-semibold text-blue-600">
            {amount.toLocaleString("fr-FR")} {currency}
          </span>{" "}
          ainsi que les conditions générales associées.
        </p>
      </div>

      {/* Champ nom complet */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Nom complet <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={`Ex: ${clientName}`}
          className="p-3 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400">
          Saisissez votre nom complet comme signature électronique
        </p>
      </div>

      {/* Case à cocher */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 cursor-pointer accent-blue-600"
        />
        <span className="text-sm text-gray-600">
          Je confirme avoir lu et accepté l'intégralité de cette proposition
          commerciale, y compris les conditions générales, et je l'accepte
          électroniquement par ma signature ci-dessus.
        </span>
      </label>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          ⚠️ {error}
        </div>
      )}

      <button
        onClick={handleSign}
        disabled={isLoading || !isValid}
        className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Signature en cours...
          </>
        ) : (
          "✅ Signer et accepter la proposition"
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Cette signature électronique a valeur légale. La date, l'heure et votre
        adresse IP seront enregistrées comme preuve d'acceptation.
      </p>
    </div>
  );
}