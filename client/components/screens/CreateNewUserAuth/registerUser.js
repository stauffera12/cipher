import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../app/store/actions/authActions';
import { Video } from 'expo-av';
import IridescentButton from '../../ui/Button/iridescentButton';
import CustomAlert from '../../ui/Alert/registerAlerts';

const RegisterUser = ({ navigation }) => {
    const [passcode, setPasscode] = useState("");
    const [isPasscodeCorrect, setIsPasscodeCorrect] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const [username, setUsername] = useState("");
    const [showEnterButton, setShowEnterButton] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const dispatch = useDispatch();
    const videoRef = useRef(null);

    const correctPasscode = "#Cipher101";

    useEffect(() => {
        StatusBar.setHidden(true);
        
        if (videoRef.current) {
          videoRef.current.playAsync();
        }
        
        return () => {
          StatusBar.setHidden(false);
        };
      }, []);

    const handleUsernameChange = (text) => {
        setUsername(text);
        setShowEnterButton(text.trim().length > 0);
    };

    const handleBiometricAuth = async () => {
        try {
            const biometricAuth = await LocalAuthentication.authenticateAsync({
                promptMessage: "Authenticate to enter",
                fallbackLabel: "Use passcode",
                cancelLabel: "Cancel",
                disableDeviceFallback: false,
            });

            if (biometricAuth.success) {
                handleAuthSuccess();
            }
        } catch (error) {
            console.error("Biometric auth error:", error);
            Alert.alert("Error", "Authentication failed. Try again.");
        }
    };

    const handleAuthSuccess = () => {
        const user = { id: '1', name: username };
        AsyncStorage.setItem('userRegistered', 'true');
        dispatch(loginSuccess(user));
    };

    const handleUnlockAccess = () => {
        if (passcode === correctPasscode) {
            setIsPasscodeCorrect(true);
            setAlertMessage("Welcome to the Cipher");
            setShowAlert(true);
        } else {
            setAlertMessage("Incorrect passcode. Please try again.");
            setShowAlert(true);
        }
    };

    return (
        <View style={styles.container}>
            <Video
                ref={videoRef}
                source={require('../../../assets/video/cipher_vid_edit.mp4')}
                style={styles.background}
                resizeMode="cover"
                shouldPlay={true}
                isMuted={true}
            />
            <SafeAreaView style={styles.overlay}>
                {!isAccepted && (
                    <IridescentButton 
                        onPress={() => setIsAccepted(true)} 
                        title="Accept Invitation" 
                        colors={['#0b1f5e', '#2541b2', '#3a6bff', '#7678ed', '#b196ef', '#daa520', '#e0cfb1']} 
                  />
                )}

                {isAccepted && !isPasscodeCorrect && (
                    <View style={styles.inputContainer}>
                        <Text style={styles.header}>You've been granted a rare opportunity. Will you take it?</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Passcode"
                            placeholderTextColor="white"
                            value={passcode}
                            onChangeText={setPasscode}
                            secureTextEntry
                        />
                        <IridescentButton 
                            title="Unlock Access" 
                            colors={['#0b1f5e', '#2541b2', '#3a6bff', '#7678ed', '#b196ef', '#daa520', '#e0cfb1']}
                            onPress={handleUnlockAccess}
                        />
                    </View>
                )}

                {isPasscodeCorrect && (
                    <View style={styles.inputContainer}>
                        <Text style={styles.header}>Who you are is up to you.</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Alias"
                            placeholderTextColor="white"
                            value={username}
                            onChangeText={handleUsernameChange}
                        />
                        {username.length > 0 && (
                            <TouchableOpacity onPress={handleBiometricAuth}>
                                <IridescentButton 
                                    title="Enter the Cipher" 
                                    colors={['#0b1f5e', '#2541b2', '#3a6bff', '#7678ed', '#b196ef', '#daa520', '#e0cfb1']}
                                    onPress={handleBiometricAuth}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </SafeAreaView>
            {/* Custom Alert Component */}
            <CustomAlert 
                    visible={showAlert} 
                    message={alertMessage} 
                    onClose={() => setShowAlert(false)} 
                />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    inputContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(21, 32, 86, 0.8)',
        padding: 25,
        borderRadius: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'black',
        width: 250,
        padding: 10,
        borderRadius: 6,
        textAlign: 'center',
        color: 'white',
        marginBottom: 20,
        fontSize: 22,

        alignItems: 'center',  
        justifyContent: 'center',

        // OPTIONAL: Very subtle border to define the shape
        borderWidth: 8,  
        borderColor: 'rgba(255, 255, 255, 0.3)', // Faint white border  

        // White Glow Effect
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 0 }, 
        shadowOpacity: 0.9,  // Strong glow effect
        shadowRadius: 15,  // Increase the blur/spread of the glow
        elevation: 15,  // Android glow effect
    },
    button: {
        backgroundColor: 'silver',
        padding: 10,
        borderRadius: 6,
        width: 175,
        alignItems: 'center',  // Center text inside
        justifyContent: 'center',
        color: 'black',
        textAlign: 'center',
        fontSize: 22
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 18,
    },
    header: {
        fontSize: 18,
        fontWeight: '800',
        fontStyle: "italic",
        color: '#E0CFB1',
        marginBottom: 15,
        textAlign: 'center'
    }
});

export default RegisterUser;