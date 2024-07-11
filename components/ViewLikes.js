import { useEffect, useState } from 'react';
import {StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { firebaseAuth, firebaseDb } from "@/firebaseConfig";
import { getDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const auth = firebaseAuth;
const db = firebaseDb;
const placeholder = require('@/assets/images/placeholder.png');

const Result = ({ userId }) => {

    const [username, setUsername] = useState('');
    const [userPic, setUserPic] = useState(null);
    const [currFriends, setCurrFriends] = useState([]);
    const [following, setFollowing] = useState(false);

    const findUsername = async () => {
        const findUsername = (await getDoc(doc(db, 'users', userId))).data();
        const findFriends = (await getDoc(doc(db, 'users', auth.currentUser.uid))).data();
        setUsername(findUsername.username);
        setCurrFriends(findFriends.friends);
        if(currFriends.includes(userId)) {
            setFollowing(true);
        }
        if (findUsername.profilePic) {
            setUserPic(findUsername.profilePic);
        }
    }

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

    useEffect(() => {
        if (currFriends.includes(userId)) {
            setFollowing(true);
        } else {
            setFollowing(false);
        }
    }, [currFriends]);

    if (!username) {
        return null;
    }

    return (
        <View style={styles.cardContainer}>
            <Image resizeMode='auto' source={userPic ? {uri: userPic} : placeholder} style={styles.imageContainer} />
            <View style={styles.usernameContainer}>
                <Text style={styles.username}>
                    {username}
                </Text>
            </View>
            {
                userId === auth.currentUser.uid 
                    ? 
                    <View></View>
                    :
                    <TouchableOpacity style={styles.buttonContainerr} onPress={following ? Unfollow : Follow}>
                        <Text style={styles.buttonText}>{following ? 'Following' : "Follow"}</Text>
                    </TouchableOpacity>
            }
            
        </View>
    );
}

export default function ViewLikes({ route }) {

    const { usersLiked } = route.params;
    const parsedUsers = JSON.parse(usersLiked);
    return (
        <View style={styles.container}>
            <FlatList
            data={parsedUsers}
            renderItem={({ item }) => {
            return (
            <Result
                userId={item}
            />
            )}
            }
            keyExtractor={(item) => item}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 35,
        marginTop: 15,
        marginHorizontal: 15,
    },
    cardContainer: {
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        padding: 22,
        marginVertical: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    usernameContainer: {
        textAlign: 'center',
    },
    username: {
        fontSize: 13,
        color: "#000",
        fontWeight: '400',
    },
    buttonContainerr: {
        display: 'flex',
        backgroundColor: '#EC6337',
        borderRadius: 40,
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    buttonText: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '400',
        textAlign: 'center',
    },
    imageContainer: {
        width: 45,
        height: 45,
        borderRadius: 50,
    },
})