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
import { logoutUser } from '../../../app/store/actions/authActions';
import { useNavigation } from "@react-navigation/native";
import IridescentButton from '../../ui/Button/iridescentButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GlobalNetwork = () => {
    const user = useSelector(state => state.auth.user);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [avatar, setAvatar] = useState(null);
    const [displayName, setDisplayName] = useState(user?.name || "");

    const handleLogout = async () => {
        try {
          dispatch(logoutUser());
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          console.log('User logged out successfully');
          // Navigate to the login or home screen if needed (using navigation)
        } catch (error) {
          console.error('Error during logout:', error);
        }
      };

    return (
        <SafeAreaView style={styles.safeArea}>
            <TouchableOpacity 
                style={styles.avatarContainer}
            >
                {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Ionicons name="person" size={40} color="#666" />
                    </View>
                )}
            </TouchableOpacity>

            <View style={{ marginTop: 10 }}>
            <IridescentButton 
              title="Create My Cipher Identity" 
              colors={['#0b1f5e', '#2541b2', '#3a6bff', '#7678ed', '#b196ef', '#daa520', '#e0cfb1']}
              onPress={handleLogout}
            />
           </View>
        </SafeAreaView>
    );
    
}

const styles = {
    safeArea: {
      flex: 1,
      backgroundColor: 'black'
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
  };

export default GlobalNetwork;