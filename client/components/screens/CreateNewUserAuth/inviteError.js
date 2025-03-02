import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, StatusBar, Alert, BackHandler } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

const InviteError = ({ route }) => {
    const videoRef = useRef(null);
    
    // Get error reason from route params if available
    const errorReason = route?.params?.reason || 'unknown';

    // Disable hardware back button on Android
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true; // Return true to prevent default back behavior
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    useEffect(() => {
        StatusBar.setHidden(true);
        
        if (videoRef.current) {
          videoRef.current.playAsync();
        }
        
        return () => {
          StatusBar.setHidden(false);
        };
    }, []);

    // Get error message based on reason
    const getErrorMessage = () => {
        switch(errorReason) {
            case 'missing_code':
                return "This invitation link is missing a code. Please check your invite or request a new one.";
            case 'invalid_code':
                return "This invitation code is invalid. Please check your invite or request a new one.";
            case 'expired_code':
                return "This invitation has expired. Please request a new invitation.";
            case 'unsupported_platform':
                return "Please open this link on your mobile device to proceed with the invitation.";
            default:
                return "This invitation link is invalid or expired. Please check your invite or request a new one.";
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
                <View style={styles.inputContainer}>
                    <Text style={styles.header}>{getErrorMessage()}</Text>
                    {errorReason !== 'unsupported_platform' && (
                        <>
                            <Text style={styles.header}>OR</Text>
                            <Text style={styles.header}>Please open this link on your mobile device to proceed with the invitation.</Text>
                        </>
                    )}
                </View>
            </SafeAreaView>
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
    header: {
        fontSize: 18,
        fontWeight: '800',
        fontStyle: "italic",
        color: '#E0CFB1',
        marginBottom: 15,
        textAlign: 'center'
    }
});

export default InviteError;