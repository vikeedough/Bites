import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Touchable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const placeholder = require('@/assets/images/placeholder.png');

export default function Post() {

    const [image, setImage] = useState(null);
    

    return(
        <View style={styles.container}>
            <View style={styles.captionContainer}>
                <Text style={styles.captionText}>Caption</Text>
            </View>
            <TextInput style={styles.description} placeholder='Add a description!' multiline />
            <TouchableOpacity style={styles.imageUploadContainer}>
                {
                    image === null ? 
                        <Text>Add Image</Text>
                        :
                        <Image resizeMode='auto' source={placeholder} style={Styles.uploadedImage} />
                    
                }
            </TouchableOpacity>
            <View style={styles.locationContainer}>
                <TouchableOpacity style={styles.imageTextContainer}>
                    <Ionicons name="cafe-sharp" color={"black"} size={18} />
                    <Text style={styles.addLocationText}>Add Location</Text>
                    <Ionicons name="chevron-forward" color={"grey"} size={18} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.postButton}>
                <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        padding: 16,
    },
    captionContainer: {
        width: '100%',
    },
    captionText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        borderColor: 'rgba(224, 224, 224, 1)',
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 9,
        padding: 16,
        justifyContent: 'center',
        fontSize: 12,
        lineHeight: 17,
        width: '100%',
        minHeight: 100,
        fontSize: 18,
    },
    imageUploadContainer: {
        borderColor: 'rgba(190, 190, 190, 1)',
        borderWidth: 1,
        borderRadius: 12,
        borderStyle: 'dashed',
        display: 'flex',
        marginTop: 17,
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1,
        padding: 60,
    },
    uploadedImage: {
        position: 'relative',
        width: 34,
        margin: 30,
        aspectRatio: 1,
    },
    locationContainer: {
        display: 'flex',
        marginTop: 30,
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
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#EC6337',
        alignSelf: 'stretch',
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginVertical: 40,
    },
    postButtonText: {
        fontSize: 18,
        color: 'white',
    }
});