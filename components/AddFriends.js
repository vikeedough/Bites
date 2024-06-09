import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Button, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { firebaseAuth, firebaseApp, firebaseDb } from '@/firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";

const app = firebaseApp;
const auth = firebaseAuth;
const db = firebaseDb;
const userRef = collection(db, "users");
let DATA = [];

export default function AddFriends(){

    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState([])

    const fetchUsers = async () => {
        const querySnapshot = await getDocs(userRef);
        const usernames = [];
        querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.username) {
            usernames.push({id: doc.id, name: data.username});
        }
        DATA = usernames;
    });
    }

    useEffect(() => {
        fetchUsers().then(() => {
            console.log(DATA);
            if (search === "") {
                setFiltered([]);
            } else {
                const cleaned = DATA.filter((item) => 
                    item.name.toLowerCase().includes(search.toLowerCase()));
                setFiltered(cleaned);
                console.log(cleaned);
            }
        });
    }, [search]);

    const Result = ({name}) => (
        <View>
            <Text>{name}</Text>
        </View>
    );

    const renderItem = ({item}) => <Result name={item.name} />

    return (
        <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSearch}
                        value={search}
                    />
                    <FlatList 
                        data={filtered}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        padding: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ff924a',
        height: 35,
    },

});