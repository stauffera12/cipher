import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as LocalAuthentication from 'expo-local-authentication';
import { MaterialIcons } from '@expo/vector-icons';

const LoginPage = ({ navigation }) => {
    const dispatch = useDispatch();
    const [alias, setAlias] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
    
    // Check if device supports biometric authentication
    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricAvailable(compatible);
        })();
    }, []);

    const handleAliasLogin = () => {
        if (!alias.trim()) {
            Alert.alert('Error', 'Please enter your alias');
            return;
        }
        
        setIsLoading(true);
        
        // Simulate API call - replace with your actual authentication logic
        setTimeout(() => {
            const user = { id: '1', name: alias };
            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
            dispatch({ type: 'SET_AUTHENTICATED', payload: true });
            setIsLoading(false);
            navigation.navigate('GlobalNetwork');
        }, 1000);
    };

    const handleBiometricLogin = async () => {
        try {
            const biometricAuth = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to continue',
                fallbackLabel: 'Use your alias instead',
                disableDeviceFallback: false,
            });

            if (biometricAuth.success) {
                setIsLoading(true);
                // Fetch user data based on stored credentials
                // This is simulated here, but would normally retrieve from secure storage
                setTimeout(() => {
                    const savedUser = { id: '1', name: 'Saved User' }; // Normally retrieved from storage
                    dispatch({ type: 'LOGIN_SUCCESS', payload: savedUser });
                    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
                    setIsLoading(false);
                    navigation.navigate('GlobalNetwork');
                }, 800);
            }
        } catch (error) {
            Alert.alert('Error', 'Authentication failed. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Your Alias</Text>
                <TextInput
                    style={styles.input}
                    value={alias}
                    onChangeText={setAlias}
                    placeholder="Enter your alias"
                    placeholderTextColor="#666"
                    autoCapitalize="none"
                />
            </View>
            
            <TouchableOpacity 
                style={styles.loginButton} 
                onPress={handleAliasLogin}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Text>
            </TouchableOpacity>
            
            {isBiometricAvailable && (
                <TouchableOpacity 
                    style={styles.biometricButton}
                    onPress={handleBiometricLogin}
                >
                    <MaterialIcons name="fingerprint" size={28} color="white" />
                    <Text style={styles.biometricText}>Use Biometric Login</Text>
                </TouchableOpacity>
            )}
            
            <TouchableOpacity 
                style={styles.forgotButton}
                onPress={() => Alert.alert('Reset', 'Contact support to reset your alias')}
            >
                <Text style={styles.forgotText}>Forgot your alias?</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        color: 'white',
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1a1a1a',
        color: 'white',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        width: '100%',
        borderWidth: 1,
        borderColor: '#333',
    },
    loginButton: {
        backgroundColor: '#5568FE',
        paddingVertical: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    biometricButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        padding: 15,
        borderRadius: 8,
        backgroundColor: 'rgba(85, 104, 254, 0.2)',
        width: '100%',
    },
    biometricText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },
    forgotButton: {
        marginTop: 30,
    },
    forgotText: {
        color: '#999',
        fontSize: 14,
    }
});

export default LoginPage;