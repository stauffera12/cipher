import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";

const PrivacyPolicy = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Cipher Privacy Policy</Text>
      <Text style={styles.date}>Last Updated: March 3, 2025</Text>

      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.text}>
        This Privacy Policy explains how Cipher collects, uses, and protects
        your personal information. By using Cipher, you agree to this policy.
      </Text>

      <Text style={styles.sectionTitle}>2. Data We Collect</Text>
      <Text style={styles.text}>We collect the following personal data:</Text>
      <Text style={styles.listItem}>
        - Identity Information: Name, email, profile photo, driver's license.
      </Text>
      <Text style={styles.listItem}>- Contact Information: Phone number, email.</Text>
      <Text style={styles.listItem}>
        - Location Data: Approximate geographic location.
      </Text>
      <Text style={styles.listItem}>- Usage Data: Interactions, posts, and connections.</Text>
      <Text style={styles.listItem}>
        - Financial Data: Credit card details for purchases.
      </Text>
      <Text style={styles.listItem}>
        - Biometric Data: Facial recognition, fingerprint authentication.
      </Text>

      <Text style={styles.sectionTitle}>3. How We Use Your Data</Text>
      <Text style={styles.text}>We use your data for the following purposes:</Text>
      <Text style={styles.listItem}>- Account creation and identity verification.</Text>
      <Text style={styles.listItem}>- Security and fraud prevention.</Text>
      <Text style={styles.listItem}>- Personalizing content and recommendations.</Text>
      <Text style={styles.listItem}>- Processing payments and marketplace transactions.</Text>
      <Text style={styles.listItem}>- Enforcing our Terms and Conditions.</Text>

      <Text style={styles.sectionTitle}>4. Cookies and Tracking Technologies</Text>
      <Text style={styles.text}>
        We use cookies, web beacons, and similar technologies to enhance your
        experience, collect usage information, and enable certain functionality.
      </Text>

      <Text style={styles.sectionTitle}>5. Data Protection & Security</Text>
      <Text style={styles.listItem}>- All user data is encrypted.</Text>
      <Text style={styles.listItem}>- Internal controls restrict access to sensitive data.</Text>
      <Text style={styles.listItem}>- Screenshots are disabled to protect user identity.</Text>

      <Text style={styles.sectionTitle}>6. Data Retention & Deletion</Text>
      <Text style={styles.text}>
        User data is retained indefinitely unless explicitly requested for deletion.
      </Text>

      <Text style={styles.sectionTitle}>7. User Controls & Rights</Text>
      <Text style={styles.text}>Users have the right to:</Text>
      <Text style={styles.listItem}>- Request data deletion.</Text>
      <Text style={styles.listItem}>- Control identity visibility.</Text>
      <Text style={styles.listItem}>- Manage settings.</Text>

      <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
      <Text style={styles.text}>
        Cipher is designed for users 16 years and older. We do not knowingly
        collect data from users under 16.
      </Text>

      <Text style={styles.sectionTitle}>9. International Data Transfers</Text>
      <Text style={styles.text}>
        By using Cipher, you consent to your data being processed in the United States.
      </Text>

      <Text style={styles.sectionTitle}>10. California Privacy Rights</Text>
      <Text style={styles.text}>
        California residents have rights under CCPA, including data access and
        deletion requests.
      </Text>

      <Text style={styles.sectionTitle}>11. Data Breach Notification</Text>
      <Text style={styles.text}>
        We will notify users and authorities in case of a data breach.
      </Text>

      <Text style={styles.sectionTitle}>12. Consent Withdrawal</Text>
      <Text style={styles.text}>
        Users can withdraw consent for data processing at any time.
      </Text>

      <Text style={styles.sectionTitle}>13. Automated Decision Making</Text>
      <Text style={styles.text}>
        We use algorithms for moderation, account actions, and personalized recommendations.
      </Text>

      <Text style={styles.sectionTitle}>14. Law Enforcement & Legal Requests</Text>
      <Text style={styles.text}>We comply with legal requests for user data.</Text>

      <Text style={styles.sectionTitle}>15. Third-Party Services</Text>
      <Text style={styles.text}>
        We may use third-party services for authentication, payments, and analytics.
      </Text>

      <Text style={styles.sectionTitle}>16. Updates to Privacy Policy</Text>
      <Text style={styles.text}>
        We may update this Privacy Policy. Continued use of Cipher means acceptance of changes.
      </Text>

      <Text style={styles.footer}>
        For privacy-related inquiries, contact: privacy@cipher.app
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 10,
    marginBottom: 5,
  },
  footer: {
    marginTop: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default PrivacyPolicy;
