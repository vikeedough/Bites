import { Modal, View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'; 


export default function PostInfo({ isVisible, onClose }) {

    return (
        <Modal animationType='fade' transparent={true} visible={isVisible}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <View style={styles.container}>
                        <View style={styles.modalContent}>
                            <Text style={styles.title}>Post</Text>

                            <Text style={styles.mainBody}>Welcome to the Post Page! 
                                Here is where you can upload a picture of your food for your friends to see!
                                Include a location in your post to let them know where they can eat it too!
                                Tag your friends in your post to let everyone know who you ate the food with!
                                </Text>

                            <Text style={styles.subTitle}>Uploading a post</Text>
                            <Text style={styles.mainBody}>Type in a caption and upload an image of your food before pressing 
                                'Post' button!
                            </Text>

                            <Text style={styles.subTitle}>Add Location</Text>
                            <Text style={styles.mainBody}>Tap on the 'Add Location' button to tag a location to the post! Select from
                                the list of NUS canteens or even enter your own location!
                            </Text>

                            <Text style={styles.subTitle}>Tag Friends</Text>
                            <Text style={styles.mainBody}>Tap on the 'Tag Friends' button to tag your friends in your post!
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
