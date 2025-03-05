import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  SafeAreaView,
  Dimensions 
} from 'react-native';

const CustomAnonymitySettings = () => {
  // Updated state to include 3rd-degree and extended network
  const [identityRules, setIdentityRules] = useState({
    personalIdentity: {
      fullName: {
        '1stDegree': false,
        '2ndDegree': false,
        '3rdDegree': false,
        'extendedNetwork': false
      },
      profileImage: {
        '1stDegree': false,
        '2ndDegree': false,
        '3rdDegree': false,
        'extendedNetwork': false
      },
      location: {
        '1stDegree': false,
        '2ndDegree': false,
        '3rdDegree': false,
        'extendedNetwork': false
      }
    },
    professionalIdentity: {
      workTitle: {
        '1stDegree': false,
        '2ndDegree': false,
        '3rdDegree': false,
        'extendedNetwork': false
      },
      company: {
        '1stDegree': false,
        '2ndDegree': false,
        '3rdDegree': false,
        'extendedNetwork': false
      },
      skills: {
        '1stDegree': false,
        '2ndDegree': false,
        '3rdDegree': false,
        'extendedNetwork': false
      }
    }
  });

  const [communicationRules, setCommunicationRules] = useState({
    messageAccess: {
      '1stDegree': 'all',
      '2ndDegree': 'filtered',
      '3rdDegree': 'restricted',
      'extendedNetwork': 'minimal'
    },
    postVisibility: {
      '1stDegree': 'full',
      '2ndDegree': 'partial',
      '3rdDegree': 'minimal',
      'extendedNetwork': 'none'
    }
  });

  const [trustScoringRules, setTrustScoringRules] = useState({
    mutualConnections: {
      threshold: 3,
      weight: 0.3
    },
    interactionQuality: {
      positiveInteractions: {
        threshold: 5,
        weight: 0.4
      },
      responseRate: {
        threshold: 70,
        weight: 0.3
      }
    },
    verificationSteps: {
      emailVerification: true,
      phoneVerification: false,
      linkedInValidation: false
    }
  });

  const renderIdentitySection = (category, section) => (
    <View style={styles.ruleSection}>
      <Text style={styles.sectionTitle}>{category} {section} Visibility</Text>
      {['1stDegree', '2ndDegree', '3rdDegree', 'extendedNetwork'].map(connectionType => (
        <View key={connectionType} style={styles.connectionRow}>
          <Text style={styles.connectionLabel}>{connectionType} Connections</Text>
          <Switch
            value={identityRules[category][section][connectionType]}
            onValueChange={(value) => {
              setIdentityRules(prev => ({
                ...prev,
                [category]: {
                  ...prev[category],
                  [section]: {
                    ...prev[category][section],
                    [connectionType]: value
                  }
                }
              }));
            }}
          />
        </View>
      ))}
    </View>
  );

  const renderTrustScoringSection = () => (
    <View style={styles.ruleSection}>
      <Text style={styles.sectionTitle}>Trust Scoring Configuration</Text>
      
      <View style={styles.scoringRow}>
        <Text style={styles.scoringText}>Minimum Mutual Connections</Text>
        <Text style={styles.scoringText}>{trustScoringRules.mutualConnections.threshold}</Text>
      </View>
      
      <View style={styles.scoringRow}>
        <Text style={styles.scoringText}>Positive Interactions Threshold</Text>
        <Text style={styles.scoringText}>{trustScoringRules.interactionQuality.positiveInteractions.threshold}</Text>
      </View>
      
      <View style={styles.verificationSection}>
        <Text style={styles.sectionSubtitle}>Verification Steps</Text>
        {Object.entries(trustScoringRules.verificationSteps).map(([step, enabled]) => (
          <View key={step} style={styles.connectionRow}>
            <Text style={styles.connectionLabel}>{step.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Text>
            <Switch
              value={enabled}
              onValueChange={(value) => {
                setTrustScoringRules(prev => ({
                  ...prev,
                  verificationSteps: {
                    ...prev.verificationSteps,
                    [step]: value
                  }
                }));
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.title}>Custom Anonymity Settings</Text>
        
        {/* Personal Identity Section */}
        {renderIdentitySection('personalIdentity', 'fullName')}
        {renderIdentitySection('personalIdentity', 'profileImage')}
        {renderIdentitySection('personalIdentity', 'location')}
        
        {/* Professional Identity Section */}
        {renderIdentitySection('professionalIdentity', 'workTitle')}
        {renderIdentitySection('professionalIdentity', 'company')}
        {renderIdentitySection('professionalIdentity', 'skills')}
        
        {/* Trust Scoring Section */}
        {renderTrustScoringSection()}
        
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Custom Rules</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
    padding: 5,
    paddingTop: 30
  },
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  scrollViewContent: {
    paddingBottom: 100, // Ensures content is not cut off
    paddingHorizontal: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white'
  },
  ruleSection: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white'
  },
  connectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5
  },
  connectionLabel: {
    fontSize: 16,
    color: 'white'
  },
  scoringRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5
  },
  scoringText: {
    color: 'white',
    fontSize: 16
  },
  verificationSection: {
    marginTop: 10
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white'
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40 // Added extra bottom margin
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
};

export default CustomAnonymitySettings;