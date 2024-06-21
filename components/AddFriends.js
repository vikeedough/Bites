import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Button, FlatList, Image, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { firebaseAuth, firebaseApp, firebaseDb } from '@/firebaseConfig';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, arrayUnion, getDoc, arrayRemove } from "firebase/firestore";

const app = firebaseApp;
const auth = firebaseAuth;
const db = firebaseDb;
const userRef = collection(db, "users");
const placeholder = require('@/assets/images/placeholder.png');
let DATA = [];

export default function AddFriends(){

    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState([])
    const [refreshing, setRefreshing] = useState(true);

    const fetchUsers = async () => {
        const querySnapshot = await getDocs(userRef);
        const currFriends = await getDoc(doc(db, 'users', auth.currentUser.uid)).then(
            (item) => {return (item.data().friends)}
        )
        const usernames = [];
        querySnapshot.forEach(async (doc) => {
        const data = doc.data();
        if (data.username) {
            usernames.push({id: doc.id, name: data.username, uri: data.profilePic});
        }
        DATA = usernames;
        if (search === "") {
            const cleanedNewOwner = DATA.filter((item) => 
                item.id != auth.currentUser.uid  
            );
            const cleanedNewFollowed = cleanedNewOwner.filter((item) => 
                !currFriends.includes(item.id)
            );
            setFiltered(cleanedNewFollowed);
        } else {
            const cleaned = DATA.filter((item) => 
                item.name.toLowerCase().includes(search.toLowerCase()));
            const cleanedOwner = cleaned.filter((item) => 
                item.id != auth.currentUser.uid)
            const cleanedFollowed = cleanedOwner.filter((item) =>
                !currFriends.includes(item.id))
            setFiltered(cleanedFollowed);
            console.log(cleanedFollowed);
        }
        setRefreshing(false);
    });
    }

    useEffect(() => {
        fetchUsers().then(async () => {
            console.log(DATA);
            if (search === "") {
                setFiltered([]);
            } else {
                const currFriends = await getDoc(doc(db, 'users', auth.currentUser.uid)).then(
                    (item) => {return (item.data().friends)}
                )
                console.log(currFriends)
                const cleaned = DATA.filter((item) => 
                    item.name.toLowerCase().includes(search.toLowerCase()));
                const cleanedOwner = cleaned.filter((item) => 
                    item.id != auth.currentUser.uid)
                const cleanedFollowed = cleanedOwner.filter((item) =>
                    !currFriends.includes(item.id))
                setFiltered(cleanedFollowed);
                console.log(cleanedFollowed);
            }
        });
    }, [search]);

    const Result = ({ id, image, username }) => {
        
        const [following, setFollowing] = useState(false)


        const Follow = async () => {
            await updateDoc(doc(db, "users", auth.currentUser.uid),
            { friends: arrayUnion(id)}
            );
            setFollowing(true);
            console.log("Followed");
        }

        const Unfollow = async () => {
            await updateDoc(doc(db, "users", auth.currentUser.uid),
            { friends: arrayRemove(id)}
            );
            setFollowing(false);
            console.log("Unfollowed");
        }

        return (
        <TouchableOpacity>
            <View style={styles.cardContainer}>
                <Image resizeMode='auto' source={image ? {uri: image} : placeholder} style={styles.imageContainer} />
                <View style={styles.usernameContainer}>
                    <Text style={styles.username}>
                        {username}
                    </Text>
                </View>
                <TouchableOpacity style={styles.buttonContainer} onPress={following ? Unfollow : Follow}>
                    <Text style={styles.buttonText}>{following ? 'Following' : "Follow"}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
        );
    };

    const renderItem = ({item}) => <Result id={item.id} image={item.uri} username={item.name} />

    return (
        <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSearch}
                        value={search}
                    />
                </View>
                <View style={styles.bottomContainer}>
                    {
                        filtered.length === 0 ?
                            <View style={styles.noResultContainer}>
                                <Text style={styles.noResultText}>No results to show!</Text>
                            </View>
                            :
                            <FlatList 
                            data={filtered}
                            style={styles.flatList}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                            refreshControl={
                                <RefreshControl refreshing = {refreshing} onRefresh={fetchUsers} />
                            }
                            />
                    }
                    
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: '#F4F4F6',
    },
    inputContainer: {
        padding: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#EC6337',
        height: 35,
    },
    bottomContainer: 
    {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        paddingHorizontal: 15,
        minHeight: '100%',
        paddingBottom: 25,
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
    },
    imageContainer: {
        width: 45,
        height: 45,
        borderRadius: 50,
    },
    usernameContainer: {
        textAlign: 'center',
    },
    username: {
        fontSize: 13,
        color: "#000",
        fontWeight: '400',
    },
    buttonContainer: {
        backgroundColor: '#EC6337',
        borderRadius: 40,
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    buttonText: {
        fontSize: 13,
        color: '#fff',
        fontWeight: '400',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    noResultContainer: {
        display: 'flex',
        minHeight: '50%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    noResultText: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    flatList: {
        display: 'flex',
    }
});