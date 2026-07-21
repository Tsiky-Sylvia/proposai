import type { ProposalEvent } from "@/lib/type";


const eventConfig: Record<string, { label: string; icon: string; color: string }> = {
  CREATED: { label: "Proposition créée", icon: "📄", color: "bg-gray-100 text-gray-600" },
  SENT: { label: "Envoyée au client", icon: "📤", color: "bg-blue-100 text-blue-600" },
  VIEWED: { label: "Consultée par le client", icon: "👀", color: "bg-yellow-100 text-yellow-600" },
  ACCEPTED: { label: "Acceptée et signée", icon: "✅", color: "bg-green-100 text-green-600" },
  DECLINED: { label: "Refusée", icon: "❌", color: "bg-red-100 text-red-600" },
  EXPIRED: { label: "Expirée", icon: "⏰", color: "bg-orange-100 text-orange-600" },
};

export default function ProposalTimeline({ events }: { events: ProposalEvent[] }) {
  if (events.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Historique
      </h3>
      <div className="flex flex-col gap-3">
        {events.map((event, index) => {
          const config = eventConfig[event.type] ?? {
            label: event.type,
            icon: "📌",
            color: "bg-gray-100 text-gray-600",
          };

          // Parser les metadata si disponibles
          let metadata: Record<string, string> = {};
          try {
            if (event.metadata) metadata = JSON.parse(event.metadata);
          } catch {}

          return (
            <div key={event.id} className="flex items-start gap-3">
              {/* Ligne verticale */}
              <div className="flex flex-col items-center">
                <span
                  className={`text-lg w-9 h-9 flex items-center justify-center rounded-full ${config.color}`}
                >
                  {config.icon}
                </span>
                {index < events.length - 1 && (
                  <div className="w-0.5 h-4 bg-gray-200 mt-1" />
                )}
              </div>

              {/* Contenu */}
              <div className="flex flex-col gap-0.5 pt-1.5">
                <p className="text-sm font-medium text-gray-800">
                  {config.label}
                </p>
                {metadata.fullName && (
                  <p className="text-xs text-gray-500">
                    Par: {metadata.fullName}
                  </p>
                )}
                {metadata.sentTo && (
                  <p className="text-xs text-gray-500">
                    À: {metadata.sentTo}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  {new Date(event.createdAt).toLocaleDateString("fr-FR")} à{" "}
                  {new Date(event.createdAt).toLocaleTimeString("fr-FR")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}