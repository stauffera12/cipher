import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";

const TermsConditions = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cipher Terms and Conditions</Text>
      <Text style={styles.date}>Last Updated: March 3, 2025</Text>
      <Text style={styles.paragraph}>
        Welcome to Cipher! By accessing or using our app, you agree to these Terms and Conditions. If you do not agree, please do not use Cipher.
      </Text>
      <View style={styles.section}>
        <Text style={styles.heading}>1. Eligibility</Text>
        <Text style={styles.paragraph}>• Cipher is available in the USA only.</Text>
        <Text style={styles.paragraph}>• Users must be at least 16 years old.</Text>
        <Text style={styles.paragraph}>• Each person is allowed only one account per lifetime.</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>2. User Conduct</Text>
        <Text style={styles.paragraph}>• Users may post NSFW content but hate speech, offensive speech, harassment, or illegal content is strictly prohibited.</Text>
        <Text style={styles.paragraph}>• Violations of these guidelines may result in account suspension, bans, or access limitations.</Text>
        <Text style={styles.paragraph}>• Users are responsible for the content they share and must not impersonate others or engage in fraudulent activities.</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>3. Identity & Verification</Text>
        <Text style={styles.paragraph}>• Users may use pseudonyms, but real identity verification is required internally.</Text>
        <Text style={styles.paragraph}>• Email and phone verification are required for account creation.</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>4. Account Management</Text>
        <Text style={styles.paragraph}>• Users can delete their accounts, but account data may not be fully deleted unless explicitly requested.</Text>
        <Text style={styles.paragraph}>• If an account is deleted and the user wishes to return, they may request reinstatement with additional verification.</Text>
        <Text style={styles.paragraph}>• If an inviter invites a user who violates our terms, the inviter may also face penalties, with a warning in most cases unless immediate action is required.</Text>
      </View>
      {/* Continue adding sections as needed */}
      <View style={styles.section}>
        <Text style={styles.heading}>19. Changes to Terms</Text>
        <Text style={styles.paragraph}>• We may update these Terms and Conditions at any time.</Text>
        <Text style={styles.paragraph}>• Continued use of Cipher after changes means you accept the revised terms.</Text>
        <Text style={styles.paragraph}>• For questions or support, contact us at support@cipher.app.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  date: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    color: "#fff",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#fff",
  },
  paragraph: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    color: "#fff",
  },
});

export default TermsConditions;
