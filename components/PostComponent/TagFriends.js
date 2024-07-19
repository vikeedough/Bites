import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState, useCallback } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { firebaseAuth, firebaseDb } from '../../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

const auth = firebaseAuth;
const db = firebaseDb;
const placeholder = require('@/assets/images/placeholder.png');

export default function TagFriends({navigation, route}) {

    const { tags, setTags } = route.params;
    console.log(tags);

    const [currentTags, setCurrentTags] = useState(tags);
    const [input, setInput] = useState('');
    const [friends, setFriends] = useState([]);
    const [finalList, setFinalList] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const findUsername = async () => {
        try {
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            const userData = userDoc.data();
            if (userData) {
                setFriends(userData.friends);
                const finalList = await Promise.all(userData.friends.map(async (item) => {
                    const friendDoc = await getDoc(doc(db, 'users', item));
                    const friendData = friendDoc.data();
                    return {
                        id: item, // Change this to use the item as id
                        username: friendData.username,
                        profilePic: friendData.profilePic,
                    };
                }));
                setFinalList(finalList);
                console.log(finalList);
            }
        } catch (error) {
            console.error('Error fetching username:', error);
        }
    }

    useEffect(() => {
        findUsername();
    }, []);

    useEffect(() => {
        if (input !== '') {
            const filteredList = finalList.filter((item) => 
                item.username.toLowerCase().includes(input.toLowerCase()));
            setFiltered(filteredList);
        } 
        if (input === '') {
            setFiltered(finalList); // Show all friends when input is empty
        }
    }, [input, finalList]);

    const Result = ({ id, username, profilePic }) => {

        const [image, setImage] = useState(profilePic);
        const [tagged, setTagged] = useState(tags.includes(id));

        useEffect(() => {
            setTagged(currentTags.includes(id));
        }, [currentTags]);

        const addTag = () => {
            const updatedTags = [...currentTags, id];
            setCurrentTags(updatedTags);
        }

        const removeTag = () => {
            const updatedTags = currentTags.filter((item) => item !== id);
            setCurrentTags(updatedTags)
        }

        // useEffect(() => {
        //     const findDetails = async () => {
        //         try {
        //             const userDoc = await getDoc(doc(db, 'users', id));
        //             const userData = userDoc.data();
        //             if (userData) {
        //                 setUsername(userData.username);
        //                 setImage(userData.profilePic);
        //             }
        //         } catch (error) {
        //             console.error('Error fetching username:', error);
        //         }
        //     }

        //     findDetails();
        // }, [id])

        return (
            <View style={styles.cardContainer}>
                <Image resizeMode='auto' source={image ? {uri: image} : placeholder} style={styles.imageContainer} />
                <Text style={styles.locationText}>{username}</Text>
                {
                    tagged ?
                    <TouchableOpacity 
                    style={styles.buttonContainer}
                    onPress={removeTag}
                    >
                        <Text style={styles.buttonText}>Remove Tag</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity 
                    style={styles.buttonContainer}
                    onPress={addTag}
                    >
                        <Text style={styles.buttonText}>Tag Friend</Text>
                    </TouchableOpacity>
                }
            </View>
        );
    }

    const renderItem = ({item}) => <Result id={item.id} username={item.username} profilePic={item.profilePic} />

    useFocusEffect(
        useCallback(() => {
            return () => {
                setTags(currentTags);
            };
        }, [currentTags])
    );

    return (
        <View style={styles.container}>

            <View style={styles.topContainer}>
                <View style={styles.inputContainer}>
                    <AntDesign.Button 
                        name='search1' 
                        backgroundColor="#FFFFFF" 
                        color= '#EC6337' 
                        size = {15} 
                        style={{paddingEnd: 0, marginEnd: -5, marginStart: -5, }}
                        borderRadius={10}
                    />
                    <TextInput 
                        style={styles.input}
                        placeholder='Find your friends here...'
                        value={input}
                        onChangeText={setInput}
                    />
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <FlatList 
                    data={filtered}
                    style={styles.flatList}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    extraData={currentTags}
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
        height: '100%',
        width: '100%',
        backgroundColor: '#F4F4F6'
    },
    topContainer: {
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    bottomContainer: {
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        width: '90%',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#EC6337',
        backgroundColor: '#FFFFFF',
        height: 35,
    },
    input: {
        width: '93%',
    },
    flatList: {
        display: 'flex',
        width: '90%',
    },
    cardContainer: {
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        padding: 22,
        marginVertical: 5,
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
    locationText: {
    },
    buttonContainer: {
        backgroundColor: '#EC6337',
        borderRadius: 40,
        paddingVertical: 15,
        width: '40%',
    },
    buttonText: {
        fontSize: 13,
        color: '#fff',
        fontWeight: '400',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
})