import { Modal, View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'; 


export default function MapInfo({ isVisible, onClose }) {

    return (
        <Modal animationType='fade' transparent={true} visible={isVisible}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <View style={styles.container}>
                        <View style={styles.modalContent}>
                            <Text style={styles.title}>Map</Text>

                            <Text style={styles.mainBody}>Welcome to the Map! 
                                You can view the different canteens that NUS has to offer and the foods they have!
                                Food is recommended to you based on your macro goals so remember to set them in
                                your profile!</Text>

                            <Text style={styles.subTitle}>Selecting a canteen</Text>
                            <Text style={styles.mainBody}>You can search for a canteen by searching for it in the search bar 
                                or pressing on the different markers on the map!
                            </Text>

                            <Text style={styles.subTitle}>Vegetarian options</Text>
                            <Text style={styles.mainBody}>Vegetarian dishes are displayed with an icon beside it for vegetarians! To only
                                view vegetarian dishes in each canteen, set the vegetarian option in your account settings!
                            </Text>

                            <Text style={styles.subTitle}>Logging Food</Text>
                            <Text style={styles.mainBody}>Log your food straight into the Journal by pressing the 'Log Food' button
                                on the dish you've eaten at the canteen you've chosen!
                            </Text>

                            <Text style={styles.subTitle}>Directions</Text>
                            <Text style={styles.mainBody}>Need directions to the canteen? Tap on the Google Maps icon on the bottom
                                right of the screen after selecting a canteen!
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
