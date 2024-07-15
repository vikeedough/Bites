import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList, Image } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { firebaseApp, firebaseAuth, firebaseDb } from '../firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, collection, onSnapshot, getDoc } from "firebase/firestore";
import { updateProfile } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import Card from './Card';
import { useIsFocused } from '@react-navigation/native';


const auth = firebaseAuth;
const db = firebaseDb;
const placeholder = require('@/assets/images/placeholder.png');

const storage = getStorage();

export default function MainProfile({navigation}) {

    const isFocused = useIsFocused();
    let user = auth.currentUser;
    const [image, setImage] = React.useState(user.photoURL === null ? null : user.photoURL);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [currDisplayed, setCurrDisplayed] = useState('');

    const findAchievements = async () => {
        const findUser = (await getDoc(doc(db, 'users', auth.currentUser.uid))).data();
        setCurrDisplayed(findUser.selectedAchievement);
    }

    useEffect(() => {
        if (isFocused) {
        user = auth.currentUser;
        }
    }, [isFocused]);

    useEffect(() => {
        findAchievements();
    }, []);

    useEffect(() => {
        const postsRef = collection(db, "posts");
        const achievementRef = doc(db, "users", auth.currentUser.uid);
    
        const unsubscribe = onSnapshot(postsRef, (snapshot) => {
        const updatePosts = snapshot.docs.map((doc) => {
        return {
            postId: doc.id,
            userId: doc.data().userId,
            timestamp: doc.data().timestamp,
            imageURL: doc.data().pictureURL,
            caption: doc.data().caption,
            comments: doc.data().comments,
            likes: doc.data().likes,
            usersLiked: doc.data().usersLiked,
            location: doc.data().location,
        }
        });
        setPosts(updatePosts);
    });

        const unsubscribe2 = onSnapshot(achievementRef, (doc) => {
            const updateAchievement = doc.data().selectedAchievement;
            setCurrDisplayed(updateAchievement);
        });

    return () => {
        unsubscribe();
        unsubscribe2();
    };
    }, []);

    useEffect(() => {
        filterPosts();
    }, [posts]);

    const filterPosts = async () => {

        DATA = posts;
        const cleanUnfollowing = DATA.filter((item) => 
            ((item.userId === user.uid))
        );
        const sortedPosts = cleanUnfollowing.sort(
        function(p1, p2) {
            return (p2.timestamp - p1.timestamp)
        }
        );
        console.log(sortedPosts);
        setFilteredPosts(sortedPosts);
    }

    const uriToBlob = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    };

    const addImage = async () => {
        let profilePic = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1,1],
        quality: 1,
        });
        const blob = await uriToBlob(profilePic.assets[0].uri)
        let imageRef = ref(storage, user.uid + '/profilePic/profile.jpeg')
        await uploadBytes(imageRef, blob).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        });
        let url = await getDownloadURL(imageRef)
        updateProfile(user, { photoURL: url })
        await setDoc(doc(db, "users", auth.currentUser.uid), 
            { profilePic: url }, { merge: true}
        )
        if (!profilePic.canceled) {
        setImage(url);
        }
    }

    const TopCard = () => {

        return (
            <View style={styles.cardContainer}>

            <View style={styles.imageContainer}>
                {
                    image  && <Image source={ image === null ? placeholder : { uri: image }} style={{ width: 125, height: 125 }} />
                }
                    <View style={styles.uploadBtnContainer}>
                        <TouchableOpacity onPress={addImage} style={styles.uploadBtn} >
                            <Text>{image ? 'Edit' : 'Upload'} Image</Text>
                            <AntDesign name="camera" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
            </View>

            <View style={styles.welcomeContainer}>
                <Text style={styles.usernameText}> Welcome, {user.displayName}! </Text>
                {
                    currDisplayed !== ''
                    ?
                    <View style={styles.achievementContainer}>
                    <Text style={styles.achievementText}>{currDisplayed}</Text>
                    </View>
                    :
                    <View></View>

                }
                
            </View>
                
            </View>
        );
        
    }

    return (

    <View style={styles.container}>

        <FlatList
            style={styles.flatList}
            data={filteredPosts}
            //ListEmptyComponent={EmptyList}
            ListHeaderComponent={TopCard}
            contentContainerStyle={styles.flatListContainer}
            renderItem={({ item }) => {
            return (
            <Card
                id={item.postId}
                user={item.userId}
                time={item.timestamp}
                image={item.imageURL}
                caption={item.caption}
                comments={item.comments}
                likes={item.likes}
                usersLiked={item.usersLiked}
                location={item.location}
                navigation={navigation}
            />
            )}
            }
            keyExtractor={(item) => item.postId}
            />

    </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        display: 'flex',
        backgroundColor: 'white',
    },
    cardContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 15,
        borderRadius: 20,
    },
    imageContainer:{
        margin: 10,
        elevation:2,
        height:125,
        width:125,
        backgroundColor:'#efefef',
        position: 'relative',
        alignSelf: 'center',
        borderRadius:999,
        borderColor: '#EC6337',
        borderWidth: 3,
        overflow:'hidden',
    },
    uploadBtnContainer:{
        opacity:0.7,
        position:'absolute',
        right:0,
        bottom:0,
        backgroundColor:'lightgrey',
        width:'100%',
        height:'25%',
    },
    uploadBtn:{
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeContainer: {
        display: 'flex',
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    usernameText: {
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
    },
    bottomContainer: {
        display: 'flex',
        justifyContent: 'space-evenly',
        height: '70%',
        backgroundColor: '#F4F4F6',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 25,
        paddingBottom: 40,
    },
    flatList: {
        display: 'flex',
    },
    flatListContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    achievementContainer: {
        backgroundColor: '#F4F4F6',
        borderRadius: 15,
        padding: 5,
        paddingHorizontal: 15,
    },
    achievementText: {
        fontSize: 13,
        color: '#EC6337'
    },
})