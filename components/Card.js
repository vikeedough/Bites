import { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { firebaseAuth, firebaseDb } from '../firebaseConfig';
import { getDoc, onSnapshot, doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import Comments from '@/components/Modals/Comments.js';
import Options from '@/components/Modals/Options.js';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

// Initialize the time ago library
TimeAgo.addDefaultLocale(en);

const auth = firebaseAuth;
const db = firebaseDb;
const placeholder = require('@/assets/images/placeholder.png');
const timeAgo = new TimeAgo('en-US');

// Display each comment
const Result = ({ userId, commentText, navigation, navigateProfile, userPic }) => {

    const [username, setUsername] = useState('');

    // Find the username of the user that commented
    const findUsername = async () => {
        const findUsername = (await getDoc(doc(db, 'users', userId))).data();
        setUsername(findUsername.username);
    }
    
    useEffect(() => {
        findUsername();
    }, [userId]);
    
    return (
        <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => navigateProfile(navigation, userId, userPic)}>
            <Text style={styles.commentUsername}>{username}</Text>
            </TouchableOpacity>
            <Text style={styles.commentText}> {commentText}</Text>
        </View>
    )
}

// Display each post
export default function Card ({ id, user, time, image, caption, comments, likes, usersLiked, location, tags, navigation }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [optionsModalVisible, setOptionsModalVisible] = useState(false);

    const openComments = () => {
        setModalVisible(true);
    }

    const closeComments = () => {
        setModalVisible(false);
    }

    const openOptions = () => {
        setOptionsModalVisible(true);
    }

    const closeOptions = () => {
        setOptionsModalVisible(false);
    }

    // Navigate to the profile of the user
    const navigateProfile = (navigation, userId, userPic) => {
        const state = navigation.getState();
        const currentRoute = state.routes[state.index];

        if (currentRoute.name === 'ViewProfile' && currentRoute.params.user === userId) {
            return;
        }

        navigation.push('ViewProfile', {user: userId, userPic: userPic});
    }

    const postRef = doc(db, 'posts', id);
    const currentUsers = usersLiked;
    const [like, setLike] = useState(usersLiked.includes(auth.currentUser.uid));
    const [username, setUsername] = useState('');
    const [achievement, setAchievement] = useState('');
    const [userPic, setUserPic] = useState(null);
    const [currentLikes, setCurrentLikes] = useState(likes);
    const [imageUri, setImageUri] = useState('');
    const imageRef = useRef();

    // Toggle the like button
    const toggleLike = async () => {

    setLike(previousState => !previousState);
    if (!usersLiked.includes(auth.currentUser.uid)) {
        await updateDoc(postRef, {
            likes: increment(1),
            usersLiked: arrayUnion(auth.currentUser.uid)
        }).then(console.log('added one like!'));
        
        setCurrentLikes(currentLikes + 1);
    } else {
        await updateDoc(postRef, {
            likes: increment(-1),
            usersLiked: arrayRemove(auth.currentUser.uid),
        }).then(console.log('removed one like!'));
        setCurrentLikes(currentLikes - 1);
    }
    };

    // Fetch the username and achievement of the user
    useEffect(() => {
        const userRef = doc(db, "users", user);
        const unsubscribe = onSnapshot(userRef, (doc) => {
            const findAchievement = doc.data().selectedAchievement;
            const findUsername = doc.data().username;
            setAchievement(findAchievement);
            setUsername(findUsername);
            if (doc.data().profilePic) {
                setUserPic(doc.data().profilePic);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // Save the image to the device
    const saveImage = async () => {
        try {
            const postUri = await captureRef(imageRef, {
                quality: 1,
            });
            setImageUri(postUri);
        } catch (e) {
            console.log(e);
        }
    }

    // Share the image
    useEffect(() => {
        if (imageUri) {
            Sharing.shareAsync(imageUri, {
            mimeType: 'image/jpeg',
            dialogTitle: "Here is the message"
        });
        }
    }, [imageUri]);

    // Share the image
    const shareImage = async () => {
        await saveImage();
    }

    return (
    <View style={styles.postContainer} ref={imageRef} collapsable={false}>

        <View style={styles.post}>

        <View >
        <View style={styles.postHeaderContainer}>
            <View style={styles.postHeaderLeftContainer}>
            <Image resizeMode='auto' source={userPic === null ? placeholder : {uri: userPic}} style={styles.profileImage}/>
            <View style={styles.postHeader}>
                <View style={styles.postNameContainer}>
                    <TouchableOpacity onPress={() => navigateProfile(navigation, user, userPic)}>
                    <Text style={styles.postText}>{username}</Text>
                    </TouchableOpacity>
                    {
                        achievement !== ''
                        ?
                        <View style={styles.achievementContainer}>
                        <Text style={styles.achievementText}>{achievement}</Text>
                        </View>
                        :
                        <View></View>
                    }
                </View>
                
                <Text style={styles.postTime}>{timeAgo.format(Date.now() - (Date.now() - time))}</Text>
            </View>
            </View>

            <View style={styles.postHeaderRightContainer}>
                {
                    user === auth.currentUser.uid
                    ? 
                    <AntDesign.Button name='ellipsis1' backgroundColor="#FFFFFF" 
                    color= '#EC6337' size = {22} activeOpacity = {1} style={{paddingEnd: 0}} onPress={openOptions}>
                    </AntDesign.Button>
                    :
                    <View></View>
                }
            </View>
        </View>

        <View style={styles.locationTagsContainer}>
        {
                location != '' 
                ? 
                    <View style={styles.locationContainer}>
                    <AntDesign.Button name='enviromento' backgroundColor="#FFA973" 
                    color= '#FFFFFF' size = {15} activeOpacity = {1} style={{paddingEnd: 0, marginEnd: -10, marginStart: -10, marginVertical: -5,}}>
                    </AntDesign.Button>
                    <Text style={styles.locationText}>{location}</Text>
                </View>
                : <View></View>
        }

        {
                tags.length > 0 
                ?   
                        <View style={styles.locationContainer}>
                        <AntDesign.Button name='team' backgroundColor="#FFA973" 
                        color= '#FFFFFF' size = {15} activeOpacity = {1} style={{paddingEnd: 0, marginEnd: -10, marginStart: -10, marginVertical: -5,}}>
                        </AntDesign.Button>
                        <TouchableOpacity onPress={() => navigation.navigate('ViewTags', {
                            usersLiked: JSON.stringify(tags)
                        })}>
                        {
                                    tags.length === 0
                                    ?
                                    <Text style={styles.locationText}>Tag Friends</Text>
                                    :
                                    tags.length === 1
                                    ?
                                    <Text style={styles.locationText}>1 friend tagged</Text>
                                    :
                                    <Text style={styles.locationText}>{tags.length} friends tagged</Text>

                        }
                        </TouchableOpacity>
                        </View>
                : <View></View>
        }
        </View>
        
        <View style={styles.imageContainer}>
            <Image
            resizeMode='contain'
            style={styles.image}
            source={{ uri: image }}
            />
        </View>
        

        <View style={styles.likeCommentContainer}>

        <View style={styles.likesAndComments}>
            <TouchableOpacity style={styles.likesContainer} onPress={() => navigation.navigate('ViewLikes', {
                usersLiked: JSON.stringify(usersLiked)
            })}>
                <Text style={styles.likes}>
                <Text>{usersLiked.length}</Text>
                <Text>{usersLiked.length === 1 ? ' like' : ' likes'}</Text>
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.commentsContainer} onPress={openComments}>
                <Text style={styles.likes}>
                <Text>{comments.length}</Text>
                <Text>{comments.length === 1 ? ' comment' : ' comments'}</Text>
                </Text>
            </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <TouchableOpacity onPress={() => navigateProfile(navigation, user, userPic)}>
                <Text style={styles.usernameWeight}>{username} </Text>
            </TouchableOpacity>
            <View>
            <Text style={styles.usernameText}>
                <Text>{caption}</Text>
            </Text>
            </View>
            
        </View>

        <View style={styles.commentsLeftIndent}>
            {comments.slice(0, 2).map( (item, id) => {
            return (
                <Result userId={item.userId} commentText={item.commentText} navigation={navigation} navigateProfile={navigateProfile} />
            )
            })}
        </View>
        </View>
        </View>

        

        <View style={styles.postBottom}>
        <AntDesign.Button name={like ? 'like1' : 'like2'} backgroundColor="#FFFFFF" 
        color= '#EC6337' size = {30} onPress = {toggleLike} activeOpacity = {1} style={{paddingEnd: 0}}>
        </AntDesign.Button>
        <AntDesign.Button name="message1" backgroundColor="#FFFFFF" 
        color= '#EC6337' size = {30} onPress={openComments} activeOpacity = {1} style={{paddingEnd: 0}}>
        </AntDesign.Button>
        <AntDesign.Button name="retweet" backgroundColor="#FFFFFF" 
        color= '#EC6337' size = {30} onPress={shareImage} activeOpacity = {1} style={{paddingEnd: 0}}>
        </AntDesign.Button>
        </View>

        <Comments isVisible={modalVisible} onClose={closeComments} commentsContent={comments} postRef={postRef} navigation={navigation} />
        <Options isVisible={optionsModalVisible} onClose={closeOptions} postId={id} />
    </View>
    </View>
)};

const styles = StyleSheet.create({
headerContainer: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#EC6337',
    justifyContent: 'center',
    alignItems: 'center',
},
postContainer: {
    display: 'flex',
    backgroundColor: '#F4F4F6',
},
post: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20,
},
imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
},
image: {
    height: 320,
    width: 320,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
},
headerText: {
    marginTop: 5,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
},
postHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
    marginHorizontal: 15,
},
postHeaderLeftContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '85%',
},
postNameContainer: {
    flexDirection: 'row',
    gap: 5,
}, 
achievementContainer: {
    backgroundColor: '#F4F4F6',
    borderRadius: 15,
    padding: 5,
    paddingHorizontal: 10,
},
achievementText: {
    fontSize: 11,
    color: '#EC6337'
},
postHeaderRightContainer: {
    display: 'flex',
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
},
locationTagsContainer: {
    flexDirection: 'row',
},
locationContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 4,
    paddingRight: 10,
    paddingLeft: 10,
    marginTop: 5,
    marginLeft: 15,
    borderRadius: 20,
    backgroundColor: '#FFA973',
},
locationText: {
    color: '#FFFFFF',
    fontSize: 13,
    textAlign: 'center',
},
profileImage: {
    width: 40,
    margin: 'auto 0',
    aspectRatio: 1,
    borderRadius: 999,
},
postHeader: {
    display: 'flex',
    paddingLeft: 5,
},
postText: {
    marginLeft: 5,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
},
postTime: {
    marginLeft: 5,
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'left',
},
likeCommentContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
},
likesAndComments: {
    flexDirection: 'row',
},
likesContainer: {
    width: '50%',
},
commentsContainer: {
    width: '50%',
    alignItems: 'flex-end',
},
postBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
    borderTopColor: '#D4D4D6',
    borderTopWidth: 1,
},
likes: {
    fontSize: 18,
    fontWeight: 'bold',
},
commentUsername: {
    fontWeight: 'bold',
    fontSize: 16,
},
commentText: {
    fontSize: 16,
},
usernameText: {
    fontSize: 18,
},
usernameWeight: {
    fontWeight: 'bold',
    fontSize: 18,
},
commentsLeftIndent: {
    marginLeft: 10,
}
});