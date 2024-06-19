import { Modal, View, StyleSheet, Text, FlatList, TextInput } from 'react-native'; 
import { useState, useEffect } from 'react';
import { firebaseAuth, firebaseDb} from '@/firebaseConfig';
import { getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import AntDesign from '@expo/vector-icons/AntDesign';

const auth = firebaseAuth;
const db = firebaseDb;

const EmptyList = () => {
    return (
        <View style={styles.emptyList}>
            <Text style={styles.emptyText}>Be the first to comment!</Text>
        </View>
    )
}

const Result = ({ userId, commentText }) => {

    const [username, setUsername] = useState('');

    const findUsername = async () => {
        const findUsername = (await getDoc(doc(db, 'users', userId))).data();
        setUsername(findUsername.username);
    }
    
    useEffect(() => {
        findUsername();
      }, [userId]);
    
    return (
    <View style={styles.commentContainer}>
        <Text>
            <Text style={styles.commentUsername}>{username}</Text>
            <Text style={styles.commentText}> {commentText}</Text>
        </Text>
    </View>
    )
}

export default function Comments( {isVisible, commentsContent, onClose, postRef} ) {

    const [newComment, setNewComment] = useState('');
    const renderItem = ({item}) => <Result userId={item.userId}  commentText={item.commentText} />

    const addComment = async () => {
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

    return (
        <Modal animationType='slide' transparent={true} visible={isVisible}>
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
                    <AntDesign.Button name="upload" color= '#EC6337' backgroundColor='#F4F4F6' size = {22} onPress={addComment} />
                </View>

            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        height: '50%',
        width: '100%',
        backgroundColor: '#FFFFFF',
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
        fontSize: 16,
        color: 'white',
        width: '92%',
    },
    flatList: {
        display: 'flex',
    },
    flatListContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'left',
        height: '70%',
    },
    emptyText: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    commentContainer: {
        display: 'flex',
        paddingHorizontal: 20,
        paddingVertical: 10,
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
        borderTopColor: 'grey',
        borderTopWidth: 1,
    },
    input: {
        width: '87%',
        padding: 10,
    }
})