type Stats = {
  total: number;
  totalAmount: number;
  accepted: number;
  pending: number;
  declined: number;
  acceptedAmount: number;
};

export default function DashboardStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Total propositions
        </p>
        <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
        <p className="text-xs text-gray-400">
          {stats.totalAmount.toLocaleString("fr-FR")} € en jeu
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Acceptées
        </p>
        <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
        <p className="text-xs text-gray-400">
          {stats.acceptedAmount.toLocaleString("fr-FR")} € signés
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          En attente
        </p>
        <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
        <p className="text-xs text-gray-400">
          Brouillon, envoyée ou consultée
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Refusées
        </p>
        <p className="text-3xl font-bold text-red-500">{stats.declined}</p>
        <p className="text-xs text-gray-400">
          Taux de refus:{" "}
          {stats.total > 0
            ? Math.round((stats.declined / stats.total) * 100)
            : 0}
          %
        </p>
      </div>
    </div>
  );
}