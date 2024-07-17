import { Modal, View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'; 


export default function FoodEntryInfo({ isVisible, onClose }) {

    return (
        <Modal animationType='fade' transparent={true} visible={isVisible}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <View style={styles.container}>
                        <View style={styles.modalContent}>
                            <Text style={styles.title}>Add Food</Text>

                            <Text style={styles.mainBody}>Welcome to the Add Food page where you can 
                                log a meal entry to your Journal page! </Text>

                            <Text style={styles.subTitle}>Searchbar</Text>
                            <Text style={styles.mainBody}>Type and search for the food you want to add.</Text>

                            <Text style={styles.subTitle}>Add Your Own Food</Text>
                            <Text style={styles.mainBody}>If you would like to create your own personalised food, 
                                tap on this button to create your own meal! Fill in the respective macros 
                                and it will now be available for reference in the future.
                            </Text>

                            <Text style={styles.subTitle}>Number of Servings</Text>
                            <Text style={styles.mainBody}>Adjust the number of servings accordingly, 
                                macro levels will scale respectively (1 by default).
                            </Text>

                            <Text style={styles.subTitle}>Macros</Text>
                            <Text style={styles.mainBody}>If you feel the macros are inaccurate, tap on the 
                                individual macros and adjust them when necessary, however, this change will 
                                not be saved. You could use the "Add Own Food" feature to create a meal 
                                where you want the accurate macros to be saved.
                            </Text>

                            <Text style={styles.subTitle}>Meal Type</Text>
                            <Text style={styles.mainBody}>Select the correct meal type (Breakfast, Lunch, Dinner or Others).
                            </Text>

                            <Text style={styles.subTitle}>Add to Journal</Text>
                            <Text style={styles.mainBody}>Once you are satisfied, tap on this button 
                                to save it to your Journal page where it will immediately be reflected and logged.
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
