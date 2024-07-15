import { Modal, View, StyleSheet, Text, TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native'; 
import { firebaseDb } from '@/firebaseConfig';
import { doc, deleteDoc } from "firebase/firestore";

const db = firebaseDb;

export default function Options({ isVisible, onClose, postId }) {

    const deletePost = async () => {
        Alert.alert(
            "Delete comment",
            "Are you sure you want to delete your post?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        await deleteDoc(doc(db, "posts", postId));
                    },
                    style: "destructive"
                }
            ]
        )
    }

    return (
        <Modal animationType='fade' transparent={true} visible={isVisible}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <View style={styles.container}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.deleteButton} onPress={deletePost}>
                                <Text style={styles.deleteButtonText}>Delete post</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        width: '90%',
        borderRadius: 10,
        backgroundColor: 'white',
    },
    deleteButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'red',
        fontSize: 18,
    },
});
