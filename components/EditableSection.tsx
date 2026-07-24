"use client";

import { useState } from "react";

type EditableSectionProps = {
  title: string;
  content: string;
  fieldName: string;
  proposalId: string;
  editable:boolean;
  onSaved: (fieldName: string, newValue: string) => void;
};

export default function EditableSection({
  title,
  content,
  fieldName,
  editable,
  proposalId,
  onSaved,
}: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!value.trim()) return;
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [fieldName]: value }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Erreur lors de la sauvegarde.");
        return;
      }

      onSaved(fieldName, value);
      setIsEditing(false);
    } catch (error) {
      setError("Erreur réseau, vérifiez votre connexion.");
      console.error("Erreur:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(content);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header section */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {editable && !isEditing && (
            <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
            >
            ✏️ Modifier
            </button>
        )}
      </div>

      {/* Contenu ou textarea */}
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-4 border border-blue-200 rounded-xl text-sm text-gray-800 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
            autoFocus
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !value.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                "✅ Sauvegarder"
              )}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
          {value}
        </p>
      )}
    </div>
  );
}