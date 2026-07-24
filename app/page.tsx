import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📄</span>
          <span className="font-bold text-gray-800">ProposAI</span>
        </div>
        <div className="flex gap-3">
          <Link
            href="/sign-in"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/sign-up"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Commencer gratuitement
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 px-8 py-20 text-center gap-6">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
          <span>✨</span>
          <span>Propositions commerciales générées par l'IA en 30 secondes</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-2xl leading-tight">
          Gagnez des clients avec des propositions professionnelles
        </h1>
        <p className="text-lg text-gray-500 max-w-xl">
          Décris ton projet en quelques mots. ProposAI génère une proposition
          commerciale complète, l'envoie au client et te notifie dès qu'elle
          est signée.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/sign-up"
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-lg"
          >
            Essayer gratuitement
          </Link>
          <Link
            href="/sign-in"
            className="px-8 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors text-lg"
          >
            Se connecter
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-16 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🧠",
              title: "Génération IA",
              description:
                "Décris ton projet en langage naturel, l'IA génère une proposition professionnelle complète en 30 secondes.",
            },
            {
              icon: "📤",
              title: "Envoi et suivi",
              description:
                "Envoie la proposition au client par email avec un lien unique. Suis en temps réel quand il la consulte.",
            },
            {
              icon: "✅",
              title: "Signature électronique",
              description:
                "Le client signe directement en ligne. Tu reçois une notification immédiate et une preuve d'acceptation.",
            },
            {
              icon: "🔄",
              title: "Renouvellement",
              description:
                "Le client peut demander une nouvelle proposition. Renouvelle en un clic avec les données pré-remplies.",
            },
            {
              icon: "📊",
              title: "Dashboard complet",
              description:
                "Suis toutes tes propositions avec des statistiques claires: montant signé, taux d'acceptation, en attente.",
            },
            {
              icon: "📄",
              title: "Export PDF",
              description:
                "Exporte chaque proposition en PDF professionnel pour tes archives ou l'envoi par email.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 p-6 bg-gray-50 rounded-2xl"
            >
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="px-8 py-16 text-center flex flex-col items-center gap-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Prêt à conclure plus de contrats ?
        </h2>
        <p className="text-gray-500 max-w-md">
          Rejoins les freelances et agences qui utilisent ProposAI pour
          professionnaliser leurs propositions et gagner du temps.
        </p>
        <Link
          href="/sign-up"
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-lg"
        >
          Commencer gratuitement →
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 text-center text-sm text-gray-400 border-t border-gray-100">
        Construit avec Next.js, Prisma, Clerk, Groq et Resend
      </footer>
    </main>
  );
}