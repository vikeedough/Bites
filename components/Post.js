import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Touchable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, React } from 'react';
import { firebaseApp, firebaseAuth, firebaseDb } from '@/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';

const app = firebaseApp;
const auth = firebaseAuth;
const db = firebaseDb;
const storage = getStorage();

export default function Post() {

    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState('');
    const [picture, setPicture] = useState(null);
    const [disabled, setDisabled] = useState(false);
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

    const checkPost = () => {
        if (caption === '') {
            alert('Please include a caption in your post!');
        } else if (image === null) {
            alert('Please upload a picture for your post!');
        } else {
            sendPost();
        }
    }

    const sendPost = async () => {
        setDisabled(true);
        const blob = await uriToBlob(picture.assets[0].uri);
        let timeNow = Date.now();
        console.log(timeNow);
        let pictureRef = ref(storage, user.uid + '/posts/' + timeNow + '.jpeg');
        await uploadBytes(pictureRef, blob).then((snapshot) => {
            console.log('Uploaded picture onto Storage!');
        });
        let url = await getDownloadURL(pictureRef);
        const postObject = {
            pictureURL: url,
            caption: caption,
            time: timeNow,
            comments: []
        }
        const postsRef = doc(db, "posts", user.uid + '_' + timeNow.toString());
        await setDoc(postsRef, {
            userId: user.uid, 
            pictureURL: url,
            caption: caption,
            timestamp: timeNow,
            comments: [],
            usersLiked: [],
            likes: 0,
        }).then(() => {
            setImage(null);
            setCaption('');
            setPicture(null);
            alert('Post successfully uploaded!')
            setDisabled(false);
        });
    }

    return(
        <View style={styles.container}>

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

                <View style={styles.locationContainer}>
                    <TouchableOpacity style={styles.imageTextContainer}>
                        <Ionicons name="location-sharp" color={"black"} size={18} />
                        <Text style={styles.addLocationText}>Add Location</Text>
                        <Ionicons name="chevron-forward" color={"grey"} size={18} />
                    </TouchableOpacity>
                </View>
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
    },
    captionContainer: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'left',
        marginHorizontal: 20,
        marginTop: 10,
    },
    topContainer: {
        display: 'flex',
        width: '100%',
        paddingHorizontal: 5,
    },
    imageOuterContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
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
        fontSize: 12,
        lineHeight: 17,
        width: '100%',
        minHeight: 100,
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
        width: '70%',
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
    locationContainer: {
        display: 'flex',
        marginVertical: 15,
        alignItems: 'center',
        borderColor: 'rgba(224, 224, 224, 1)',
        borderWidth: 1,
        borderRadius: 8,
        width: '70%',
    },
    imageTextContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 10,      
    },
    addLocationText: {
        fontSize: 18,
    },
    postButton: {
        display: 'flex',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#EC6337',
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginTop: 20,
    },
    postButtonText: {
        fontSize: 18,
        color: 'white',
    }
});