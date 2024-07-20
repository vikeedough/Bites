import { Modal, View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'; 


export default function HomeScreenInfo({ isVisible, onClose }) {


    return (
        <Modal animationType='fade' transparent={true} visible={isVisible}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <View style={styles.container}>
                        <View style={styles.modalContent}>
                            <Text style={styles.title}>The Social Media Feed</Text>

                            <Text style={styles.mainBody}>Welcome to your social media feed! 
                                This is where you can view the posts you and your friends have made! 
                                Like, comment and share your friends posts and motivate one another to 
                                have healthy eating habits!</Text>

                            <Text style={styles.subTitle}>Liking or unliking a post</Text>
                            <Text style={styles.mainBody}>Press the thumbs up button on a post to like 
                                or unlike it!</Text>

                            <Text style={styles.subTitle}>Commenting on a post</Text>
                            <Text style={styles.mainBody}>Press the message bubble button to look at 
                                the comments on the post and send in your own!</Text>

                            <Text style={styles.subTitle}>Deleting a comment</Text>
                            <Text style={styles.mainBody}>Press and hold onto a comment that you made 
                                to delete it!</Text>

                            <Text style={styles.subTitle}>Sharing a post</Text>
                            <Text style={styles.mainBody}>Press the share button on a post to share it 
                                on other social media apps!</Text>

                            <Text style={styles.subTitle}>Viewing a profile</Text>
                            <Text style={styles.mainBody}>Press on a username to view their profile!</Text>

                            <Text style={styles.subTitle}>Viewing likes</Text>
                            <Text style={styles.mainBody}>Press on the number of likes a post has to 
                                look at who liked the post!</Text>

                            <Text style={styles.subTitle}>Viewing tags</Text>
                            <Text style={styles.mainBody}>Press on the number of tagged friends a post has to 
                                look at who was tagged in the post!</Text>
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
