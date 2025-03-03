import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  TextInput,
  ScrollView,
  Switch,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutUser } from '../../../app/store/actions/authActions';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

const UserDetails = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  
  // Animation and gesture references
  const pan = useRef(new Animated.ValueXY()).current;
  const sectionOpacity = useRef(new Animated.Value(1)).current;
  
  // Current section state
  const [currentSection, setCurrentSection] = useState(0);
  const totalSections = 4;
  
  // Form state
  const [avatar, setAvatar] = useState(null);
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [realName, setRealName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [defaultAnonymity, setDefaultAnonymity] = useState(true);
  const [interestAreas, setInterestAreas] = useState('');
  const [connectionGoals, setConnectionGoals] = useState('');

  const currentSectionRef = useRef(currentSection); // Ref to always have the latest value

useEffect(() => {
  currentSectionRef.current = currentSection; // Sync ref with state
}, [currentSection]);

const panResponder = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value
      });
      pan.setValue({ x: 0, y: 0 });
    },
    onPanResponderMove: Animated.event(
      [null, { dx: pan.x, dy: pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (e, gesture) => {
      pan.flattenOffset();
      
      if (gesture.dx < -SWIPE_THRESHOLD && currentSectionRef.current < totalSections - 1) {
        fadeToNextSection(1);
      } else if (gesture.dx > SWIPE_THRESHOLD && currentSectionRef.current > 0) {
        fadeToNextSection(-1);
      } else {
        // Return to center if not enough to trigger change
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: false
        }).start();
      }
    }
  })
).current;

const fadeToNextSection = (direction) => {
  
  Animated.timing(sectionOpacity, {
    toValue: 0,
    duration: 200,
    useNativeDriver: false
  }).start(() => {
    setCurrentSection(prevSection => {
      const newSection = prevSection + direction;
      currentSectionRef.current = newSection; // Update ref immediately
      return newSection;
    });

    pan.setValue({ x: 0, y: 0 });

    Animated.timing(sectionOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false
    }).start();
  });
};

  const handleSelectAvatar = () => {
    console.log('Select avatar pressed');
    // Would open image picker here
  };

  const handleSubmitProfile = async () => {
    try {
      // Dispatch the logoutUser action to clear AsyncStorage and perform logout
      dispatch(logoutUser());
      console.log('User logged out successfully');
      // Navigate to the login or home screen if needed (using navigation)
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Dot that shows current section and can be tapped to navigate
  const renderNavigationDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {Array.from({ length: totalSections }).map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (index !== currentSection) {
                fadeToNextSection(index - currentSection);
              }
            }}
          >
            <View style={styles.dotWrapper}>
              <View 
                style={[
                  styles.navigationDot,
                  currentSection === index ? styles.activeDot : {}
                ]} 
              />
              {currentSection === index && (
                <View style={styles.pulsingRing} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Section content components
  const renderIdentitySection = () => {
    return (
      <View style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>Your Identity</Text>
        <Text style={styles.sectionSubtitle}>
          How you'll be discovered in the Cipher
        </Text>
        
        <TouchableOpacity 
          style={styles.avatarContainer} 
          onPress={handleSelectAvatar}
        >
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#666" />
            </View>
          )}
        </TouchableOpacity>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="How you'll appear to connections"
            placeholderTextColor="#666"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Real Name</Text>
          <TextInput
            style={styles.input}
            value={realName}
            onChangeText={setRealName}
            placeholder="Your actual name (optional)"
            placeholderTextColor="#666"
          />
          <Text style={styles.inputNote}>Only revealed to trusted connections</Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell others about yourself"
            placeholderTextColor="#666"
            multiline={true}
            numberOfLines={4}
          />
        </View>
      </View>
    );
  };

  const renderConnectionSection = () => {
    return (
      <View style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>Connection Settings</Text>
        <Text style={styles.sectionSubtitle}>
          Control how others discover you
        </Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="City, Region, or Country"
            placeholderTextColor="#666"
          />
          <View style={styles.revealControl}>
            <Text style={styles.revealText}>Show exact location</Text>
            <Switch 
              value={false} 
              onValueChange={() => {}}
              trackColor={{ false: '#333', true: '#007AFF' }}
            />
          </View>
        </View>
        
        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>Default Anonymity</Text>
            <Text style={styles.switchDescription}>Start with hidden identity</Text>
          </View>
          <Switch 
            value={defaultAnonymity} 
            onValueChange={setDefaultAnonymity} 
            trackColor={{ false: '#333', true: '#007AFF' }}
          />
        </View>
        
        <View style={styles.revealOptions}>
          <View style={styles.revealOption}>
            <View style={styles.revealDot} />
            <Text style={styles.revealOptionText}>Reveal name after 3 messages</Text>
          </View>
          <View style={styles.revealOption}>
            <View style={styles.revealDot} />
            <Text style={styles.revealOptionText}>Reveal photo with mutual connections</Text>
          </View>
          <View style={styles.revealOption}>
            <View style={styles.revealDot} />
            <Text style={styles.revealOptionText}>Full identity after verified trust</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderInterestsSection = () => {
    return (
      <View style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>Interests & Goals</Text>
        <Text style={styles.sectionSubtitle}>
          What brings you to the network
        </Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Interest Areas</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={interestAreas}
            onChangeText={setInterestAreas}
            placeholder="Skills, topics, and activities that interest you"
            placeholderTextColor="#666"
            multiline={true}
            numberOfLines={3}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Connection Goals</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={connectionGoals}
            onChangeText={setConnectionGoals}
            placeholder="What you hope to gain from your network"
            placeholderTextColor="#666"
            multiline={true}
            numberOfLines={3}
          />
        </View>
        
        <View style={styles.tagsContainer}>
          <Text style={styles.tagsLabel}>Popular Tags</Text>
          <View style={styles.tagsList}>
            <TouchableOpacity style={styles.tag}>
              <Text style={styles.tagText}>Technology</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tag}>
              <Text style={styles.tagText}>Art</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tag}>
              <Text style={styles.tagText}>Business</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tag}>
              <Text style={styles.tagText}>Science</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tag}>
              <Text style={styles.tagText}>Design</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderFinalSection = () => {
    return (
      <View style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>Complete Your Profile</Text>
        <Text style={styles.sectionSubtitle}>
          Join the connected network
        </Text>
        
        <View style={styles.completionContainer}>
          <View style={styles.completionCircle}>
            <Ionicons name="checkmark" size={40} color="#007AFF" />
          </View>
          
          <Text style={styles.completionText}>
            Your Cipher identity is ready to be created. You'll start with:
          </Text>
          
          <View style={styles.completionDetail}>
            <Ionicons name="shield-outline" size={18} color="#999" />
            <Text style={styles.completionDetailText}>Protected identity with custom revelation rules</Text>
          </View>
          
          <View style={styles.completionDetail}>
            <Ionicons name="people-outline" size={18} color="#999" />
            <Text style={styles.completionDetailText}>Connection to your inviter's network</Text>
          </View>
          
          <View style={styles.completionDetail}>
            <Ionicons name="key-outline" size={18} color="#999" />
            <Text style={styles.completionDetailText}>Access to exclusive network content</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmitProfile}
          >
            <Text style={styles.submitText}>Create My Cipher Identity</Text>
          </TouchableOpacity>
          
          <Text style={styles.privacyNote}>
            By creating your profile, you agree to our Terms and Privacy Policy
          </Text>
        </View>
      </View>
    );
  };

  // Determine which section to render based on currentSection
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return renderIdentitySection();
      case 1:
        return renderConnectionSection();
      case 2:
        return renderInterestsSection();
      case 3:
        return renderFinalSection();
    }
  };

  // Navigation hint based on current section
  const getNavigationHint = () => {
    if (currentSection === totalSections - 1) {
      return "Tap button to complete";
    } else {
      return "Swipe left to continue";
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.header}>
          <Text style={styles.welcomeText}>{user?.username} Create Your Cipher Profile</Text>
        </View>
        
        {renderNavigationDots()}
        
        <Animated.View 
          style={[
            styles.sectionContainer,
            {
              opacity: sectionOpacity,
              transform: [
                { translateX: pan.x }
              ]
            }
          ]}
          {...panResponder.panHandlers}
        >
          <ScrollView style={styles.scrollContainer}>
            {renderCurrentSection()}
          </ScrollView>
        </Animated.View>
        
        {currentSection < totalSections - 1 && (
          <View style={styles.navigationHint}>
            <Text style={styles.navigationHintText}>{getNavigationHint()}</Text>
            {currentSection < totalSections - 1 && (
              <Ionicons name="chevron-forward" size={16} color="#999" />
            )}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  safeArea: {
    flex: 1,
    padding: 15,
  },
  header: {
    marginTop: 5,
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userText: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  dotWrapper: {
    padding: 10,
    position: 'relative',
  },
  navigationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    marginHorizontal: 10,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  pulsingRing: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    opacity: 0.5,
    top: 3,
    left: 13,
  },
  sectionContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  sectionContent: {
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 16,
    padding: 15,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 300,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 22,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    borderStyle: 'dashed',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: 'white',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#252525',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    borderWidth: 1,
    borderColor: '#444',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputNote: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#252525',
    padding: 12,
    borderRadius: 8,
  },
  switchLabel: {
    color: 'white',
    fontSize: 16,
  },
  switchDescription: {
    color: '#999',
    fontSize: 12,
  },
  revealControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  revealText: {
    color: '#999',
    fontSize: 14,
  },
  revealOptions: {
    backgroundColor: '#252525',
    borderRadius: 8,
    padding: 16,
  },
  revealOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  revealDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    marginRight: 8,
  },
  revealOptionText: {
    color: 'white',
    fontSize: 14,
  },
  tagsContainer: {
    marginTop: 20,
  },
  tagsLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#252525',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  tagText: {
    color: 'white',
    fontSize: 14,
  },
  completionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  completionCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  completionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  completionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  completionDetailText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  privacyNote: {
    color: '#999',
    fontSize: 12,
    marginTop: 16,
    textAlign: 'center',
    width: 200
  },
  navigationHint: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  navigationHintText: {
    color: '#999',
    fontSize: 14,
    width: 150
  },
});

export default UserDetails;