import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface BroadcastEmailProps {
  buyerName: string;
  subject: string;
  message: string;
}

export default function BroadcastEmail({
  buyerName,
  subject,
  message,
}: BroadcastEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>{subject}</Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* HEADER */}
          <Section style={styles.header}>
            <Text style={styles.logo}>VIBE DISTRICT</Text>

            <Text style={styles.headerLabel}>
              OFFICIAL COMMUNICATION
            </Text>
          </Section>

          {/* MAIN CONTENT */}
          <Section style={styles.content}>
            <Text style={styles.eyebrow}>
              VIBE DISTRICT
            </Text>

            <Heading style={styles.heading}>
              {subject}
            </Heading>

            <Text style={styles.greeting}>
              Hi {buyerName},
            </Text>

            <Text style={styles.message}>
              {message}
            </Text>
          </Section>

          {/* NOTICE */}
          <Section style={styles.notice}>
            <Text style={styles.noticeTitle}>
              VIBE DISTRICT
            </Text>

            <Text style={styles.noticeText}>
              This is an official message from the Vibe District
              team. Please keep an eye on your email for further
              updates regarding the event.
            </Text>
          </Section>

          {/* FOOTER */}
          <Section style={styles.footer}>
            <Text style={styles.footerBrand}>
              VIBE DISTRICT
            </Text>

            <Text style={styles.footerText}>
              Official event communications
            </Text>

            <Text style={styles.footerCopyright}>
              © {new Date().getFullYear()} Vibe District. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    margin: "0",
    padding: "0",
    backgroundColor: "#f4f4f4",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
  },

  container: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
  },

  header: {
    padding: "34px 32px 30px",
    borderBottom: "1px solid #eeeeee",
  },

  logo: {
    margin: "0",
    color: "#111111",
    fontSize: "18px",
    lineHeight: "22px",
    fontWeight: "800",
    letterSpacing: "3px",
  },

  headerLabel: {
    margin: "9px 0 0",
    color: "#999999",
    fontSize: "9px",
    lineHeight: "14px",
    fontWeight: "700",
    letterSpacing: "1.8px",
  },

  content: {
    padding: "48px 32px 38px",
  },

  eyebrow: {
    margin: "0 0 14px",
    color: "#777777",
    fontSize: "10px",
    lineHeight: "15px",
    fontWeight: "700",
    letterSpacing: "2px",
  },

  heading: {
    margin: "0 0 28px",
    color: "#111111",
    fontSize: "32px",
    lineHeight: "38px",
    fontWeight: "700",
    letterSpacing: "-0.8px",
  },

  greeting: {
    margin: "0 0 18px",
    color: "#222222",
    fontSize: "15px",
    lineHeight: "24px",
  },

  message: {
    margin: "0",
    color: "#333333",
    fontSize: "15px",
    lineHeight: "26px",
    whiteSpace: "pre-wrap" as const,
  },

  notice: {
    margin: "0 32px 40px",
    padding: "22px 22px",
    backgroundColor: "#f7f7f7",
    border: "1px solid #e9e9e9",
    borderRadius: "12px",
  },

  noticeTitle: {
    margin: "0 0 8px",
    color: "#111111",
    fontSize: "10px",
    lineHeight: "15px",
    fontWeight: "800",
    letterSpacing: "1.5px",
  },

  noticeText: {
    margin: "0",
    color: "#777777",
    fontSize: "12px",
    lineHeight: "19px",
  },

  footer: {
    padding: "30px 32px 36px",
    borderTop: "1px solid #eeeeee",
    textAlign: "center" as const,
  },

  footerBrand: {
    margin: "0 0 6px",
    color: "#111111",
    fontSize: "11px",
    lineHeight: "16px",
    fontWeight: "800",
    letterSpacing: "2px",
  },

  footerText: {
    margin: "0 0 18px",
    color: "#999999",
    fontSize: "11px",
    lineHeight: "17px",
  },

  footerCopyright: {
    margin: "0",
    color: "#bbbbbb",
    fontSize: "10px",
    lineHeight: "16px",
  },
};