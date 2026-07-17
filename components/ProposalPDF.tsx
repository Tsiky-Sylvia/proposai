import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 30,
    borderBottom: "2px solid #2563eb",
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 10,
    color: "#6b7280",
  },
  infoGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
  },
  infoLabel: {
    fontSize: 8,
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  infoValue: {
    fontSize: 11,
    color: "#1f2937",
    fontFamily: "Helvetica-Bold",
  },
  infoSubValue: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 2,
  },
  amountValue: {
    fontSize: 18,
    color: "#2563eb",
    fontFamily: "Helvetica-Bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    marginBottom: 8,
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 4,
  },
  sectionContent: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.6,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: "1px solid #e5e7eb",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#9ca3af",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#dbeafe",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 9,
    color: "#2563eb",
    fontFamily: "Helvetica-Bold",
  },
});

type ProposalPDFProps = {
  proposal: {
    title: string;
    clientName: string;
    clientEmail: string;
    clientCompany: string | null;
    amount: number;
    currency: string;
    validUntil: Date | null;
    context: string;
    deliverables: string;
    timeline: string;
    pricing: string;
    conditions: string;
    createdAt: Date;
  };
};

export default function ProposalPDF({ proposal }: ProposalPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{proposal.title}</Text>
          <Text style={styles.subtitle}>
            Proposition commerciale — générée le{" "}
            {new Date(proposal.createdAt).toLocaleDateString("fr-FR")}
          </Text>
        </View>

        {/* Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PROPOSITION COMMERCIALE</Text>
        </View>

        {/* Info grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Client</Text>
            <Text style={styles.infoValue}>{proposal.clientName}</Text>
            {proposal.clientCompany && (
              <Text style={styles.infoSubValue}>{proposal.clientCompany}</Text>
            )}
            <Text style={styles.infoSubValue}>{proposal.clientEmail}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Montant</Text>
            <Text style={styles.amountValue}>
              {proposal.amount.toLocaleString("fr-FR")} {proposal.currency}
            </Text>
            {proposal.validUntil && (
              <Text style={styles.infoSubValue}>
                Valide jusqu'au{" "}
                {new Date(proposal.validUntil).toLocaleDateString("fr-FR")}
              </Text>
            )}
          </View>
        </View>

        {/* Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contexte du projet</Text>
          <Text style={styles.sectionContent}>{proposal.context}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Livrables</Text>
          <Text style={styles.sectionContent}>{proposal.deliverables}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planning</Text>
          <Text style={styles.sectionContent}>{proposal.timeline}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tarification</Text>
          <Text style={styles.sectionContent}>{proposal.pricing}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conditions générales</Text>
          <Text style={styles.sectionContent}>{proposal.conditions}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Généré avec ProposAI
          </Text>
          <Text style={styles.footerText}>
            {new Date(proposal.createdAt).toLocaleDateString("fr-FR")}
          </Text>
        </View>
      </Page>
    </Document>
  );
}