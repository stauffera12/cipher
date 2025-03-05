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

const Profile = () => {
    const [avatar, setAvatar] = useState(null);
    

    return (
        <SafeAreaView style={styles.safeArea}>
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

export default Profile;