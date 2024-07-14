import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { firebaseAuth, firebaseDb } from '@/firebaseConfig';
import { collection, doc, getDoc, arrayRemove, updateDoc, arrayUnion } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';

const auth = firebaseAuth;
const db = firebaseDb;
const userRef = collection(db, "users");
const placeholder = require('@/assets/images/placeholder.png');
let DATA = [];

const EmptyList = () => {
    return (
        <View style={styles.emptyList}>
            <Text style={styles.emptyText}>No results to show.</Text>
        </View>
    );
};

export default function Friends({navigation}){

    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState([]);
    const [refreshing, setRefreshing] = useState(true);
    const isFocused = useIsFocused();

    const fetchFriends = async () => {
        const usernames = [];

        const friends = (await getDoc(doc(db, 'users', auth.currentUser.uid))).data().friends;

        const friendPromise = friends.map(async (id) => {
            const friendDoc = await getDoc(doc(db, 'users', id));
            const item = friendDoc.data();
            usernames.push({id: friendDoc.id, name: item.username, uri: item.profilePic});
        });

        await Promise.all(friendPromise);
        DATA = usernames;
        if (search === "") {
            setFiltered(DATA);
        } else {
            const cleaned = DATA.filter((item) => 
                item.name.toLowerCase().includes(search.toLowerCase()));
            const cleanedOwner = cleaned.filter((item) => 
                item.id != auth.currentUser.uid);
            setFiltered(cleanedOwner);
            console.log(cleanedOwner);
        }
        setRefreshing(false);
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    useEffect(() => {
        fetchFriends().then(async () => {
            console.log(DATA);
            if (search === "") {
                setFiltered(DATA);
            } else {
                const cleaned = DATA.filter((item) => 
                    item.name.toLowerCase().includes(search.toLowerCase()));
                const cleanedOwner = cleaned.filter((item) => 
                    item.id != auth.currentUser.uid);
                setFiltered(cleanedOwner);
                console.log(cleanedOwner);
            }
        });
    }, [search]);

    const Result = ({ id, image, username }) => {
        
        const [following, setFollowing] = useState(true);

        const navigateProfile = (navigation, userId, userPic) => {
            const state = navigation.getState();
            const currentRoute = state.routes[state.index];
    
            if (currentRoute.name === 'ViewProfile' && currentRoute.params.user === userId) {
                return;
            }
    
            navigation.push('ViewProfile', {user: userId, userPic: userPic});
        };

        const Follow = async () => {
            await updateDoc(doc(db, "users", auth.currentUser.uid),
            { friends: arrayUnion(id) }
            );
            setFollowing(true);
            console.log("Followed");
        };

        const Unfollow = async () => {
            await updateDoc(doc(db, "users", auth.currentUser.uid),
            { friends: arrayRemove(id) }
            );
            setFollowing(false);
            console.log("Unfollowed");
        };

        return (
            <TouchableOpacity onPress={() => navigateProfile(navigation, id, image)}>
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

            <View style={styles.topContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSearch}
                        value={search}
                    />
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <FlatList 
                    data={filtered}
                    style={styles.flatList}
                    ListEmptyComponent={EmptyList}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={fetchFriends} />
                    }
                />
            </View>

            <View>
                <TouchableOpacity style={styles.addFriendsContainer} onPress={() => navigation.navigate("Add Friends")}>
                    <Text style={styles.addFriendsButton}>Add Friends</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F6',
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        height: '10%',
    },
    inputContainer: {
        padding: 15,
        width: '90%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#EC6337',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 35,
    },
    bottomContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    cardContainer: {
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        padding: 22,
        marginVertical: 5,
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
    addFriendsContainer: {
        backgroundColor: '#EC6337',
        borderRadius: 40,
        paddingVertical: 15,
        paddingHorizontal: 30,
        margin: 15,
        alignItems: 'center',
    },
    addFriendsButton: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
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
    emptyList: {
        minHeight: '50%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    flatList: {
        flex: 1,
    },
});
