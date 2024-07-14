import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, FlatList, Image, Button, RefreshControl, TouchableOpacity } from "react-native";
import { Header } from 'react-native/Libraries/NewAppScreen';
import AntDesign from '@expo/vector-icons/AntDesign';
import {firebaseApp, firebaseAuth, firebaseDb} from '../firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDoc, onSnapshot, doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import Comments from '@/components/Modals/Comments.js';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import Card from '@/components/Card.js';
import ViewProfile from './ViewProfile';
import ViewLikes from './ViewLikes';

TimeAgo.addDefaultLocale(en);

const auth = firebaseAuth;
const db = firebaseDb;
const placeholder = require('@/assets/images/placeholder.png');
const timeAgo = new TimeAgo('en-US');

const EmptyList = () => {
  return (
    <View style={styles.emptyList}>
            <Text style={styles.emptyText}>No posts to show. Post a picture or add some friends to see their posts on your feed!</Text>
    </View>
  )
}

export default function HomeScreen({navigation}) {

  const user = auth.currentUser.uid;
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const postsRef = collection(db, "posts");
    const friendsRef = doc(db, "users", user);

    const unsubscribe = onSnapshot(postsRef, (snapshot) => {
      const updatePosts = snapshot.docs.map((doc) => {
        return {
          postId: doc.id,
          userId: doc.data().userId,
          timestamp: doc.data().timestamp,
          imageURL: doc.data().pictureURL,
          caption: doc.data().caption,
          comments: doc.data().comments,
          likes: doc.data().likes,
          usersLiked: doc.data().usersLiked,
          location: doc.data().location,
        }
      });
      setPosts(updatePosts);
    });

    const unsubscribe2 = onSnapshot(friendsRef, (doc) => {
      const updateFriends = doc.data().friends;
      setFriends(updateFriends);
    });

    return () => {
      unsubscribe();
      unsubscribe2();
    };
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, friends]);

  const filterPosts = async () => {

    DATA = posts;
    //console.log(DATA);
    const cleanUnfollowing = DATA.filter((item) => 
      ((friends.includes(item.userId)) || (item.userId === user))
    );
    const sortedPosts = cleanUnfollowing.sort(
      function(p1, p2) {
        return (p2.timestamp - p1.timestamp)
      }
    );

    setFilteredPosts(sortedPosts);
    
    //console.log("my friends: " + friends);
    //console.log(sortedPosts);
    setRefresh(false);
  }



  return (
    <View style={styles.container}>

          <View style={styles.feed}>
              <FlatList
              style={styles.flatList}
              data={filteredPosts}
              ListEmptyComponent={EmptyList}
              contentContainerStyle={styles.flatListContainer}
              renderItem={({ item }) => {
                return (
                <Card
                  id={item.postId}
                  user={item.userId}
                  time={item.timestamp}
                  image={item.imageURL}
                  caption={item.caption}
                  comments={item.comments}
                  likes={item.likes}
                  usersLiked={item.usersLiked}
                  location={item.location}
                  navigation={navigation}
                />
              )}
              }
              keyExtractor={(item) => item.postId}
              refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={filterPosts} />
              }
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
    backgroundColor: '#F4F4F6',
    height: '100%',
  },
  feed: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  flatList: {
    display: 'flex',
  },
  flatListContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyList: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
  },
});