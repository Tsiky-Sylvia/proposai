export type ProposalEvent = {
  id: string;
  type: string;
  createdAt: string;
  metadata: string | null;
};

export type Proposal = {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string | null;
  amount: number;
  currency: string;
  status: string;
  publicToken: string;
  validUntil: string | null;
  context: string;
  deliverables: string;
  timeline: string;
  pricing: string;
  conditions: string;
  createdAt: string;
  updatedAt: string;
  signedAt: string | null;
  signatureData: string | null;
  events: ProposalEvent[];
};