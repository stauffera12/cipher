import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomAlert = ({ visible, message, onClose }) => {
    return (
        <Modal transparent={true} visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    alertBox: {
        backgroundColor: "#152056",
        padding: 20,
        borderRadius: 10,
        width: 300,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E0CFB1",
    },
    message: {
        color: "white",
        fontSize: 16,
        marginBottom: 15,
        textAlign: "center",
        width: 250
    },
    button: {
        backgroundColor: "#E0CFB1",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: "#152056",
        fontWeight: "bold",
    },
});

export default CustomAlert;