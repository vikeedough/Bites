import { useState, useEffect } from 'react';
import {StyleSheet, View, FlatList, RefreshControl, Text, Image, TouchableOpacity} from 'react-native';
import { firebaseAuth, firebaseDb } from '../firebaseConfig';
import { collection, getDoc, onSnapshot, doc, arrayUnion, arrayRemove,updateDoc } from 'firebase/firestore';
import Card from '@/components/Card.js';

const auth = firebaseAuth;
const db = firebaseDb;
const placeholder = require('@/assets/images/placeholder.png');

const EmptyList = () => {
    return (
        <View style={styles.emptyList}>
                <Text style={styles.emptyText}>No posts to show.</Text>
        </View>
    )
}

const HeaderCard = ( {userId, image, username} ) => {

    const [following, setFollowing] = useState(false);
    const [currFriends, setCurrFriends] = useState([]);

    const findUsername = async () => {
        try {
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            const userData = userDoc.data();
            if (userData) {
                setCurrFriends(userData.friends || []);
                if (userData.friends && userData.friends.includes(userId)) {
                    setFollowing(true);
                }
            }
        } catch (error) {
            console.error('Error fetching friends list:', error);
        }
    };

    const Follow = async () => {
        await updateDoc(doc(db, "users", auth.currentUser.uid),
        { friends: arrayUnion(userId)}
        );
        setFollowing(true);
        console.log("Followed");
    }

    const Unfollow = async () => {
        await updateDoc(doc(db, "users", auth.currentUser.uid),
        { friends: arrayRemove(userId)}
        );
        setFollowing(false);
        console.log("Unfollowed");
    }

    useEffect(() => {
        findUsername();
    }, [userId]);

    return (
        <View style={styles.headerCardContainer}>
            <View style={styles.imageContainer}>
            {
                <Image source={ image === null ? placeholder : { uri: image }} style={{ width: 125, height: 125 }} />
            }
            </View>
            <View style={styles.headerCardRightContainer}>
                <Text style={styles.headerText}>{username}</Text>
                {
                username === auth.currentUser.displayName 
                    ? 
                    <View></View>
                    :
                    <TouchableOpacity style={styles.buttonContainerr} onPress={following ? Unfollow : Follow}>
                        <Text style={styles.buttonText}>{following ? 'Following' : "Follow"}</Text>
                    </TouchableOpacity>
            }
            </View>
        </View>
    );
}

export default function ViewProfile({ route, navigation }) {

    const { user, userPic } = route.params;

    const [username, setUsername] = useState('');
    const [userImage, setUserImage] = useState(null);

    const findUsername = async () => {
        try {
            const userDoc = await getDoc(doc(db, 'users', user));
            const userData = userDoc.data();
            console.log(userData.username);
            if (userData) {
                setUsername(userData.username || '');
                if(userData.profilePic) {
                    setUserImage(userData.profilePic);
                }
            }
        } catch (error) {
            console.error('Error fetching username:', error);
        }
    }

    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
    const postsRef = collection(db, "posts");

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

    return () => {
        unsubscribe();
    };
    }, [user]);

    useEffect(() => {
        findUsername();
    }, [user]);

    useEffect(() => {
    filterPosts();
    }, [posts]);

    const filterPosts = async () => {

    DATA = posts;
    const cleanUnfollowing = DATA.filter((item) => 
        (item.userId === user)
    );
    const sortedPosts = cleanUnfollowing.sort(
        function(p1, p2) {
        return (p2.timestamp - p1.timestamp)
        }
    );

    setFilteredPosts(sortedPosts);
    setRefresh(false);
    }

    return (
        <View style={styles.container}>

        <View style={styles.feed}>
            <FlatList
            style={styles.flatList}
            data={filteredPosts}
            ListHeaderComponent={() => <HeaderCard userId={user} image={userImage} username={username} />}
            ListEmptyComponent={EmptyList}
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
            refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={filterPosts} />
            }
        />
        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F4F4F6',
        height: '100%',
    },
    feed: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    },
    flatList: {
    display: 'flex',
    width: '100%',
    },
    flatListContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    },
    emptyList: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    },
    emptyText: {
    textAlign: 'center',
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
    headerCardContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginTop: 10,
        paddingHorizontal: 30,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    headerCardRightContainer: {
        paddingHorizontal: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
    },
    buttonContainerr: {
        display: 'flex',
        backgroundColor: '#EC6337',
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 30,
        width: '110%',
    },
    buttonText: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '400',
        textAlign: 'center',
    },
})