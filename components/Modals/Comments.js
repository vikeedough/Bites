import { Modal, View, StyleSheet, Text, FlatList, TextInput, TouchableWithoutFeedback, TouchableOpacity, Image } from 'react-native'; 
import { useState, useEffect } from 'react';
import { firebaseAuth, firebaseDb} from '@/firebaseConfig';
import { getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import ViewProfile  from '../ViewProfile.js'; 
import AntDesign from '@expo/vector-icons/AntDesign';

const auth = firebaseAuth;
const db = firebaseDb;
const placeholder = require('@/assets/images/placeholder.png');

const EmptyList = () => {
    return (
        <View style={styles.emptyList}>
            <Text style={styles.emptyText}>Be the first to comment!</Text>
        </View>
    )
}

const Result = ({ userId, commentText, navigation }) => {

    const [username, setUsername] = useState('');
    const [userPic, setUserPic] = useState(null);

    const findUsername = async () => {
        const findUsername = (await getDoc(doc(db, 'users', userId))).data();
        if (!findUsername) {
            setUsername(null);
        } else {
            setUsername(findUsername.username);
            if (findUsername.profilePic) {
                setUserPic(findUsername.profilePic);
            }
        }
        
    }
    
    useEffect(() => {
        findUsername();
    }, [userId]);
    
    if (username === null) {
        return null;
    }

    return (
    <View style={styles.commentContainer}>

        <Image resizeMode='auto' source={userPic ? {uri: userPic} : placeholder} style={styles.imageContainer} />

        <View>
            <TouchableOpacity onPress={() => navigation.navigate('ViewProfile', { user: userId })}>
                <Text style={styles.commentUsername}>{username}</Text>
            </TouchableOpacity>
        </View>
            
        <View>
            <Text style={styles.commentText}> {commentText}</Text>
        </View>

    </View>
    )
}

export default function Comments( {isVisible, commentsContent, onClose, postRef, navigation} ) {

    const [newComment, setNewComment] = useState('');
    const renderItem = ({item}) => <Result userId={item.userId}  commentText={item.commentText} navigation={navigation} />

    const addComment = async () => {
        if (newComment !== '') {
            const timeNow = Date.now();
            const newCommentId = auth.currentUser.uid + '_' + timeNow.toString();
            const commentObject = {
                id: newCommentId,
                commentText: newComment,
                userId: auth.currentUser.uid
            }
            await updateDoc(postRef, {
                comments: arrayUnion(commentObject)
            });
            setNewComment('');
        }
    }  

    return (
        <Modal animationType='slide' transparent={true} visible={isVisible}>

            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>

            <View style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.headerText}>Comments</Text>
                    <AntDesign.Button name="close" color= 'white' backgroundColor='#EC6337' size = {22} onPress={onClose} />
                </View>

                <View style={styles.flatListContainer}>
                    <FlatList 
                        data={commentsContent}
                        style={styles.flatList}
                        ListEmptyComponent={EmptyList}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setNewComment}
                        value={newComment}
                        placeholder='Type in your comment here'
                    />
                    <AntDesign.Button name="upload" color= '#EC6337' backgroundColor='#F4F4F6' size = {22} onPress={addComment} style={{paddingEnd: 0, marginLeft: 5,}} />
                </View>

            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
    },
    container: {
        display: 'flex',
        height: '50%',
        width: '100%',
        backgroundColor: '#F4F4F6',
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        position: 'absolute',
        bottom: 0,
    }, 
    header: {
        display: 'flex',
        height: '15%',
        backgroundColor: '#EC6337',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: 20,
        color: 'white',
        width: '92%',
        fontWeight: 'bold',
    },
    flatList: {
        display: 'flex',
    },
    flatListContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'left',
        height: '70%',
        paddingVertical: 10,
    },
    emptyText: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    imageContainer: {
        width: 25,
        height: 25,
        borderRadius: 50,
        marginRight: 5,
    },
    commentContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        marginVertical: 5,
        marginHorizontal: 15,
        borderRadius: 15,
    },
    commentUsername: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    commentText: {
        fontSize: 16,
    },
    inputContainer: {
        display: 'flex',
        height: '18%',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#F4F4F6',
        borderTopWidth: 1,
        borderColor: '#6B6B6B',

    },
    input: {
        width: '85%',
        padding: 10,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginLeft: 10,
    }
})