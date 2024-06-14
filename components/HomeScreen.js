import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, FlatList, Image } from "react-native";
import { Header } from 'react-native/Libraries/NewAppScreen';
import AntDesign from '@expo/vector-icons/AntDesign';
import {firebaseApp, firebaseAuth} from '../firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth';

const placeholder = require('@/assets/images/placeholder.png');

const post1 = {
  user: 'vikeedough',
  time: '1m',
  image: require('@/assets/images/8URRTRj.jpeg'),
  caption: 'Had a fantastic dinner!',
  comments: [{
    user: 'deseansoh',
    text: 'looks good!',
    id: 1,
  }],
};

const post2 = {
  user: 'StJ0nas',
  time: '27m',
  image: require('@/assets/images/eHbSCbN.jpeg'),
  caption: 'Im hungry already',
  comments: [{
    user: 'neeeegel',
    text: 'where is this place!',
    id: 1,
  }, {
    user: 'deseansoh',
    text: 'invite me too!',
    id: 2,
  }],
};

const post3 = {
  user: 'vikeedough',
  time: '49m',
  image: require('@/assets/images/2UpCLk2.jpeg'),
  caption: 'My first post!',
  comments: [],
};

const feed = [
  {
    post: post1,
    id: 1,
  },
  {
    post: post2,
    id: 2,
  },
  {
    post: post3,
    id: 3,
  },
];

const Newpost = ({ user, time, image, caption, comments }) => {

  const [like, setLike] = useState(false)
  const toggleLike = () => setLike(previousState => !previousState);

  return (
  <View style={newStyles.postContainer}>

    <View style={newStyles.headerContainer}>
      <Image resizeMode='auto' source={placeholder} style={newStyles.profileImage}/>
      <View style={newStyles.headerTextContainer}>
        <Text style={newStyles.username}>{user}</Text>
        <Text style={newStyles.postTime}>{time}</Text>
      </View>
    </View>

    <Image  source={image} style={newStyles.postImage} />

    <View style={newStyles.detailsContainer}>
      <Text style={newStyles.username}>{user}</Text>
      <Text style={newStyles.captionText}>{caption}</Text>
    </View>

    {comments.map((comment) => {
        return (
          <Text style={newStyles.commentUsername}>
            {comment.user} <Text style={newStyles.commentContent}>{comment.text}</Text>
          </Text>
        )}
      )
    }

    <View style={newStyles.iconsContainer}>
      <AntDesign.Button name={like ? 'like1' : 'like2'} backgroundColor="#ffffff" 
      color= '#EC6337' size = {30} onPress = {toggleLike} activeOpacity = {1}>
      </AntDesign.Button>
      <AntDesign.Button name="message1" backgroundColor="#ffffff" 
      color= '#EC6337' size = {30}>
      </AntDesign.Button>
      <AntDesign.Button name="retweet" backgroundColor="#ffffff" 
      color= '#EC6337' size = {30}>
      </AntDesign.Button>
    </View>

  </View>
)};

const Post = ({ user, time, image, caption, comments }) => {
  
  const [like, setLike] = useState(false)
  const toggleLike = () => setLike(previousState => !previousState);

  return (
  <View style={styles.post}>
    <View style={styles.postHeaderContainer}>
      <Image resizeMode='auto' source={placeholder} style={styles.profileImage}/>
      <View style={styles.postHeader}>
        <Text style={styles.postText}>{user}</Text>
        <Text style={styles.postTime}>{time}</Text>
      </View>
    </View>
    <Image
      style={{
        width: 320,
        height: 320,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginVertical: 10,
      }}
      source={image}
    />
    <Text style={{fontSize: 18}}>
      <Text style={{fontWeight: "bold"}}>{user}</Text>
      <Text> {caption}</Text>
    </Text>
    <View style={{marginLeft: 10}}>
      {comments.map((comment) => {
        return (
          <Text>
            <Text style={{fontWeight: "bold"}}>{comment.user}</Text>
            <Text> {comment.text}</Text>
          </Text>
        )
      })}
    </View>
    <View style={styles.postBottom}>
      <AntDesign.Button name={like ? 'like1' : 'like2'} backgroundColor="#fff0db" 
      color= '#EC6337' size = {30} onPress = {toggleLike} activeOpacity = {1}>
      </AntDesign.Button>
      <AntDesign.Button name="message1" backgroundColor="#fff0db" 
      color= '#EC6337' size = {30}>
      </AntDesign.Button>
      <AntDesign.Button name="retweet" backgroundColor="#fff0db" 
      color= '#EC6337' size = {30}>
      </AntDesign.Button>
    </View>
  </View>
)};

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      
      <View style={styles.feed}>
        <FlatList
          data={feed}
          renderItem={({ item }) => {
            return (
            <Post
              user={item.post.user}
              time={item.post.time}
              image={item.post.image}
              caption={item.post.caption}
              comments={item.post.comments}
            />
          )}
          }
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#fff0db',
  },
  post: {
    display: 'flex',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#fff0db',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerText: {
    marginTop: 5,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  feed: {
    display: 'flex',
  },
  postHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
  },
  profileImage: {
    width: 40,
    margin: 'auto 0',
    aspectRatio: 1,
    borderRadius: 999,
  },
  postHeader: {
    display: 'flex',
  },
  postText: {
    marginLeft: 5,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  postTime: {
    marginLeft: 5,
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'left',
  },
  postBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const newStyles = StyleSheet.create({
  postContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  headerTextContainer: {
    paddingRight: 5,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  postTime: {
    color: '#828282',
    fontSize: 12,
  },
  postImage: {
    width: '70%',
    height: '70%',
    aspectRatio: 1,
    marginTop: 12,
  },
  detailsContainer: {
    display: 'flex',
    marginTop: 12,
    alignItems: 'stretch',
    gap: 7,
  },
  captionText: {
    fontSize: 13
  },
  commentText: {
    color: '#828282',
    marginTop: 9,
    fontSize: 10,
    fontWeight: '600',
    width: '90%',
  },
  commentContent: {
    fontWeight: '400',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: "space-around",
  }
})