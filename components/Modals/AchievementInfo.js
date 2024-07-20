import { Modal, View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'; 


export default function AchievementInfo({ isVisible, onClose }) {


    return (
        <Modal animationType='fade' transparent={true} visible={isVisible}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <View style={styles.container}>
                        <View style={styles.modalContent}>
                            <Text style={styles.title}>Achievements</Text>

                            <Text style={styles.mainBody}>Welcome to your Achievements page! 
                                You can track your progress for each achievement here and also flex an achievement
                                on your profile!</Text>

                            <Text style={styles.subTitle}>Displaying an achievement on your profile</Text>
                            <Text style={styles.mainBody}>Tap on an achievement that you have successfully attained
                                to display it on your profile! Tapping on an achievement that is currently selected
                                will remove it from your profile!
                            </Text>

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
        padding: 10,
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        paddingBottom: 10,
    },
    mainBody: {
        fontSize: 16,
    },
    subTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        paddingTop: 10,
    }
});
