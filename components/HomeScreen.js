import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, FlatList, Image, Button, RefreshControl } from "react-native";
import { Header } from 'react-native/Libraries/NewAppScreen';
import AntDesign from '@expo/vector-icons/AntDesign';
import {firebaseApp, firebaseAuth, firebaseDb} from '../firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDoc, onSnapshot, doc } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en);

const auth = firebaseAuth;
const db = firebaseDb;
const postsRef = collection(db, "posts");
const placeholder = require('@/assets/images/placeholder.png');
const timeAgo = new TimeAgo('en-US');

const Post = ({ user, time, image, caption, comments }) => {
  
  const [like, setLike] = useState(false);
  const [username, setUsername] = useState('');
  const [userPic, setUserPic] = useState(null);
  const toggleLike = () => setLike(previousState => !previousState);

  const findUsername = async () => {
    const findUsername = (await getDoc(doc(db, 'users', user))).data();
    setUsername(findUsername.username);
    setUserPic(findUsername.profilePic);
  }

  useEffect(() => {
    findUsername();
  }, [user]);

  return (
  <View style={styles.post}>
    <View style={styles.postHeaderContainer}>
      <Image resizeMode='auto' source={userPic === null ? placeholder : {uri: userPic}} style={styles.profileImage}/>
      <View style={styles.postHeader}>
        <Text style={styles.postText}>{username}</Text>
        <Text style={styles.postTime}>{timeAgo.format(Date.now() - (Date.now() - time))}</Text>
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
      source={{ uri: image }}
    />
    <Text style={{fontSize: 18}}>
      <Text style={{fontWeight: "bold"}}>{username}</Text>
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

  const user = auth.currentUser.uid;
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [friends, setFriends] = useState([]);

  const checkPost = () => {
    console.log(posts);
    console.log(friends);
    console.log(filteredPosts);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(postsRef, (snapshot) => {
      const updatePosts = snapshot.docs.map((doc) => {
        return {
          postId: doc.id,
          userId: doc.data().userId,
          timestamp: doc.data().timestamp,
          imageURL: doc.data().pictureURL,
          caption: doc.data().caption,
          comments: doc.data().comments,
        }
      });
      setPosts(updatePosts);

      fetchFriends().then(console.log('done finding friends'));
      filterPosts().then(console.log('done filtering posts'));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [user]);

  useEffect(() => {
     filterPosts();
  }, [posts, user]);

  const fetchFriends = async () => {
    const friendsList = await getDoc(doc(db, "users", user)).then(
      (item) => {return (item.data().friends)}
    )
    setFriends(friendsList);
  }

  const filterPosts = async () => {

    fetchFriends().then(console.log('done filtering friends'));

    DATA = posts;
    console.log(DATA);
    const cleanUnfollowing = DATA.filter((item) => 
      ((friends.includes(item.userId)) || (item.userId === user))
    );
    const sortedPosts = cleanUnfollowing.sort(
      function(p1, p2) {
        return (p2.timestamp - p1.timestamp)
      }
    );

    setFilteredPosts(sortedPosts);
    
    console.log("my friends: " + friends);
    console.log(sortedPosts);
    setRefresh(false);
  }



  return (
    <View style={styles.container}>
      <View style={styles.feed}>
        {
          
          filteredPosts.length === 0 ? 
            <View style={styles.noPostContainer}>
              <Text style={styles.noPostText}>No posts to show!</Text>
            </View>
          :<View style={styles.feed}>
              <FlatList
              style={styles.flatList}
              data={filteredPosts}
              renderItem={({ item }) => {
                return (
                <Post
                  user={item.userId}
                  time={item.timestamp}
                  image={item.imageURL}
                  caption={item.caption}
                  comments={item.comments}
                />
              )}
              }
              keyExtractor={(item) => item.postId}
              refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={filterPosts} />
              }
            />
            </View>
        }
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
    minHeight: '100%',
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
  flatList: {
    display: 'flex',
  },
  noPostContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPostText: {
    fontSize: 30,
    fontWeight: 'bold',
  }
});