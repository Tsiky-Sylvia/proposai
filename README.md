# ProposAI — Générateur de propositions commerciales intelligent

Application web permettant aux freelances et PME de générer des propositions commerciales professionnelles en 30 secondes via l'IA, de les envoyer aux clients avec un lien unique, et d'être notifié dès qu'elles sont signées.

🔗 **Demo live**: https://proposai-chi.vercel.app

---

## Fonctionnalités

- Génération de proposition commerciale via IA (Groq / Llama 3) à partir d'une description en langage naturel
- Envoi au client par email avec lien unique de consultation
- Suivi en temps réel (créée, envoyée, consultée, acceptée, refusée)
- Signature électronique simple avec preuve d'acceptation (nom, date, IP)
- Refus explicite avec motif + demande de renouvellement côté client
- Renouvellement en un clic côté freelance (formulaire pré-rempli)
- Édition des sections générées par l'IA (mode brouillon uniquement)
- Export PDF professionnel
- Dashboard avec statistiques (montant signé, taux d'acceptation, en attente)
- Filtres et recherche sur les propositions
- Timeline des événements par proposition
- Authentification complète (Clerk)
- Données persistées par utilisateur (PostgreSQL / Neon)
- Notifications email (Resend)

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 15 (App Router) |
| Langage | TypeScript |
| Style | Tailwind CSS |
| Auth | Clerk |
| Base de données | PostgreSQL (Neon) |
| ORM | Prisma + @prisma/adapter-neon |
| IA | Groq API (Llama 3.3 70B) |
| Email | Resend |
| PDF | @react-pdf/renderer |
| Déploiement | Vercel |

---

## Défis techniques rencontrés

**1. Connexion PostgreSQL sans VPN**
Le port 5432 était bloqué sur le réseau local. Résolu en utilisant `@prisma/adapter-neon` qui passe par WebSockets (port 443) au lieu de TCP direct.

**2. Conflit de types entre @react-pdf/renderer et React**
`renderToBuffer` refusait le composant React standard. Résolu en castant l'élément avec `as ReactElement<DocumentProps>`.

**3. useSearchParams() sans Suspense boundary**
Next.js App Router exige un `Suspense` boundary autour de `useSearchParams()` en production. Non détecté en dev, bloquant le build Vercel.

**4. Client Prisma non généré sur Vercel**
Le dossier `app/generated/prisma` n'existe pas dans le repo (gitignore). Résolu en ajoutant `"postinstall": "prisma generate"` dans `package.json`.

**5. Webhook Clerk bloqué par le middleware**
Le middleware Clerk redirigait les requêtes webhook vers `/sign-in`. Résolu en ajoutant `/api/webhooks(.*)` dans les routes publiques.

**6. Envoi email en production**
Resend en tier gratuit limite l'envoi à l'adresse email du compte. Un domaine vérifié est nécessaire pour envoyer à n'importe quelle adresse en production.

---

## Architecture
app/
├── api/
│ ├── proposals/
│ │ ├── route.ts # GET (liste) / POST (création + IA)
│ │ └── [id]/
│ │ ├── route.ts # GET / PATCH / DELETE
│ │ ├── send/route.ts # POST — envoi email client
│ │ └── pdf/route.ts # GET — export PDF
│ ├── public/
│ │ └── proposals/
│ │ └── [token]/
│ │ ├── route.ts # GET — vue publique client
│ │ ├── sign/route.ts # POST — signature
│ │ ├── decline/route.ts # POST — refus
│ │ └── renew-request/route.ts # POST — demande renouvellement
│ └── webhooks/clerk/route.ts # Sync utilisateurs
├── dashboard/page.tsx
├── proposals/
│ ├── new/page.tsx
│ └── [id]/page.tsx
├── p/[token]/page.tsx # Page publique client
├── sign-in/[[...sign-in]]/page.tsx
├── sign-up/[[...sign-up]]/page.tsx
├── error.tsx
├── global-error.tsx
├── not-found.tsx
└── page.tsx # Landing page
components/
├── ProposalForm.tsx
├── ProposalView.tsx
├── ProposalCard.tsx
├── ProposalTimeline.tsx
├── PublicProposalView.tsx
├── SignatureForm.tsx
├── DeclineForm.tsx
├── RenewRequestForm.tsx
├── EditableSection.tsx
├── DashboardStats.tsx
└── ProposalPDF.tsx
lib/
├── prisma.ts
├── email.ts
├── prompts.ts
├── types.ts
└── prisma-errors.ts


---

## Installation locale

```bash
git clone https://github.com/TON-USERNAME/proposai.git
cd proposai
npm install
```

Configure les variables d'environnement dans `.env.local`:

DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
GROQ_API_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000

Lance le projet:

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

---

## Fonctionnalités prévues (v2)

- Domaine vérifié Resend pour envoi email illimité
- Templates de propositions personnalisables
- Intégration Stripe pour acompte en ligne
- Multi-langues (EN, FR, MG)
- Application mobile

---

## Notes

> Projet réalisé dans le cadre d'un portfolio développeur full-stack.
> Construit en 15 jours avec Next.js, Prisma, Clerk, Groq et Resend.