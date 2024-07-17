import { Modal, View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'; 


export default function JournalInfo({ isVisible, onClose }) {


    return (
        <Modal animationType='fade' transparent={true} visible={isVisible}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <View style={styles.container}>
                        <View style={styles.modalContent}>
                            <Text style={styles.title}>Journal</Text>

                            <Text style={styles.mainBody}>Welcome to your very own Journal page! 
                                You can log your meals and track your calories easily here. You can also 
                                view previous journal entries and stay consistent to achieve your weight goal!</Text>

                            <Text style={styles.subTitle}>Calendar</Text>
                            <Text style={styles.mainBody}>Tap on the Calendar to change to any date you want.</Text>

                            <Text style={styles.subTitle}>Delete Entry</Text>
                            <Text style={styles.mainBody}>Tap and hold on any entry you want to delete and a pop up will appear, 
                                asking you to confirm deletion.
                            </Text>

                            <Text style={styles.subTitle}>Add Food</Text>
                            <Text style={styles.mainBody}>Tap on the Add Food button to add a meal entry to the current
                                day you have selected (current day by default).</Text>

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
