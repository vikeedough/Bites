import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { firebaseApp, firebaseAuth, firebaseDb } from '@/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import * as Progress from 'react-native-progress';

const app = firebaseApp;
const auth = firebaseAuth;
const db = firebaseDb;
const storage = getStorage();

export default function Post({navigation}) {

    const MARKERS = [{
        title: 'Frontier',
        id: 0,
    }, {
        title: 'PGP Canteen',
        id: 1,
    }, {
        title: 'Techno Edge',
        id: 2,
    }, {
        title: 'The Deck',
        id: 3,
    }, {
        title: 'The Terrace',
        id: 4,
    }, {
        title: 'Fine Food',
        id: 5,
    }, {
        title: 'Flavours',
        id: 6,
    }];

    const [location, setLocation] = useState('');
    const [tags, setTags] = useState([]);
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState('');
    const [picture, setPicture] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const user = auth.currentUser;

    const uriToBlob = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    };

    const addImage = async () => {
        let picture = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1,1],
            quality: 1,
        });
        setPicture(picture);
        if (!picture.canceled) {
            setImage(picture.assets[0].uri);
        }
    }

    useEffect(() => {
        
    }, [isLoading]);

    const checkPost = async () => {

        try {
            if (caption === '') {
                alert('Please include a caption in your post!');
            } else if (image === null) {
                alert('Please upload a picture for your post!');
            } else {
                setIsLoading(true);
                await sendPost();
    
                const docRef = doc(db, 'users', auth.currentUser.uid);
                const docSnapshot = await getDoc(docRef)

                const totalPosts = docSnapshot.data().numberOfPosts;
                const newTotalPosts = totalPosts + 1;

                await updateDoc(docRef, {
                    numberOfPosts : newTotalPosts
                });
            }
        }

        catch (error) {
            console.log("Error in Posting " + error)
        } 

        finally {
            setIsLoading(false);
        }
    }

    const sendPost = async () => {
        setDisabled(true);
        console.log(isLoading);
        const blob = await uriToBlob(picture.assets[0].uri);
        let timeNow = Date.now();
        console.log(timeNow);
        let pictureRef = ref(storage, user.uid + '/posts/' + timeNow + '.jpeg');
        await uploadBytes(pictureRef, blob).then((snapshot) => {
            console.log('Uploaded picture onto Storage!');
        });
        let url = await getDownloadURL(pictureRef);
        const postsRef = doc(db, "posts", user.uid + '_' + timeNow.toString());
        await setDoc(postsRef, {
            userId: user.uid, 
            pictureURL: url,
            caption: caption,
            timestamp: timeNow,
            comments: [],
            usersLiked: [],
            likes: 0,
            location: location,
            tags: tags,
        }).then(() => {
            setImage(null);
            setCaption('');
            setPicture(null);
            setLocation('');
            setTags([]);
            Alert.alert('', 'Post successfully uploaded!', [{text: 'Understood'}]);
            setDisabled(false);
        });
    }

    return(
        <View style={styles.container}>

            {
                isLoading && (
                    <View style={styles.loadingContainer}>
                        <Progress.Circle size={50} indeterminate={true} color={'#EC6337'} borderWidth={4}/>
                    </View>
                )

            }

            <View style={styles.topContainer}>
                <View style={styles.topInnerContainer}>
                    <View style={styles.captionContainer}>
                        <Text style={styles.captionText}>Caption</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.description} 
                            placeholder='Add a description!'
                            onChangeText={setCaption}
                            value={caption} 
                            multiline />
                    </View>
                </View>
            </View>

            <View style={styles.imageOuterContainer}>
                <TouchableOpacity style={styles.imageUploadContainer} onPress={addImage}>
                    {
                        image === null ? 
                        <Ionicons name="add-circle-outline" color={"black"} size={24} />
                            :
                            <Image source={{uri: image}} style={styles.uploadedImage} />
                        
                    }
                </TouchableOpacity>
                
            </View>

            <View style={styles.locationContainer}>
                    <TouchableOpacity style={styles.imageTextContainer} 
                        onPress={() => navigation.navigate("AddLocation", { setLocation })}
                        disabled={location !== ''}
                    >
                        <View style={styles.locationTextContainer}>
                            <Ionicons name="location-sharp" color={"black"} size={18} />
                            {
                                location === ''
                                ?
                                <Text style={styles.addLocationText}>Add Location</Text>
                                :
                                <Text style={styles.addLocationText}>{location}</Text>
                            }
                        </View>
                        
                        {
                            location === ''
                            ?
                            <Ionicons name="chevron-forward" color={"grey"} size={18} />
                            :
                            <Ionicons name="close-circle-outline" color={"grey"} size={18} onPress={() => setLocation('')}/>
                        }
                        
                    </TouchableOpacity>
                </View>

                <View style={styles.locationContainer}>
                    <TouchableOpacity style={styles.imageTextContainer} 
                        onPress={() => navigation.navigate("TagFriends", {tags, setTags})}
                    >
                        <View style={styles.locationTextContainer}>
                            <AntDesign name="team" color={"black"} size={18} />
                            {
                                tags.length === 0
                                ?
                                <Text style={styles.addLocationText}>Tag Friends</Text>
                                :
                                tags.length === 1
                                ?
                                <Text style={styles.addLocationText}>1 friend tagged</Text>
                                :
                                <Text style={styles.addLocationText}>{tags.length} friends tagged</Text>

                            }
                        </View>
                        
                            <Ionicons name="chevron-forward" color={"grey"} size={18} />

                        
                    </TouchableOpacity>
                </View>
            

            <TouchableOpacity style={styles.postButton} onPress={checkPost} disabled={disabled}>
                <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        gap: 10,
    },
    captionContainer: {
        display: 'flex',
        paddingTop: 15,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'left',
        marginHorizontal: 20,
    },
    topContainer: {
        display: 'flex',
        width: '100%',
        paddingHorizontal: 5,
        height: '25%',
    },
    imageOuterContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: '35%',
        borderRadius: 20,
        paddingHorizontal: 5,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
    },
    topInnerContainer: {
        display: 'flex',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        margin: 10,
    },
    captionText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        textAlignVertical: 'center',
    },
    inputContainer: {
        display: 'flex',
        padding: 15,
    },
    description: {
        borderColor: 'rgba(224, 224, 224, 1)',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        justifyContent: 'center',
        fontSize: 10,
        lineHeight: 17,
        width: '100%',
        fontSize: 18,
        backgroundColor: '#FFFFFF'
    },
    imageUploadContainer: {
        borderColor: 'rgba(190, 190, 190, 1)',
        borderWidth: 1,
        borderRadius: 12,
        borderStyle: 'dashed',
        display: 'flex',
        marginVertical: 15,
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1,
    },
    uploadedImage: {
        position: 'relative',
        width: '100%',
        margin: 30,
        aspectRatio: 1,
    },
    locationTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        width: '90%',
    },
    locationContainer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(224, 224, 224, 1)',
        borderWidth: 1,
        borderRadius: 8,
        height: '7%',
        width: '90%',
    },
    imageTextContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-around',
        gap: 10,
        padding: 10,      
    },
    addLocationText: {
        fontSize: 18,
    },
    postButton: {
        display: 'flex',
        width: '90%',
        height: '7%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#EC6337',
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    postButtonText: {
        fontSize: 18,
        color: 'white',
    },
    dropdownContainer: {
        width: '80%',
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(224, 224, 224, 1)',
    },
    suggestionsListContainer: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        top: -70,
        zIndex: 5,
    },
    input: {
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        textAlign: 'center',
        borderColor: 'rgba(224, 224, 224, 1)',
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    }
});