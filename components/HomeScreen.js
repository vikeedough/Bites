import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, FlatList, Image, Button, RefreshControl } from "react-native";
import { Header } from 'react-native/Libraries/NewAppScreen';
import AntDesign from '@expo/vector-icons/AntDesign';
import {firebaseApp, firebaseAuth, firebaseDb} from '../firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDoc, onSnapshot, doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import Comments from '@/components/Modals/Comments.js';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

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

const Result = ({ userId, commentText }) => {

  const [username, setUsername] = useState('');

  const findUsername = async () => {
      const findUsername = (await getDoc(doc(db, 'users', userId))).data();
      setUsername(findUsername.username);
  }
  
  useEffect(() => {
      findUsername();
    }, [userId]);
  
  return (
      <Text>
          <Text style={styles.commentUsername}>{username}</Text>
          <Text style={styles.commentText}> {commentText}</Text>
      </Text>
  )
}

const Post = ({ id, user, time, image, caption, comments, likes, usersLiked }) => {
  
  const [modalVisible, setModalVisible] = useState(false);

  const openComments = () => {
    setModalVisible(true);
  }

  const closeComments = () => {
    setModalVisible(false);
  }

  const postRef = doc(db, 'posts', id);
  let initialLikes = likes;
  const currentUsers = usersLiked;
  const [like, setLike] = useState(usersLiked.includes(auth.currentUser.uid));
  const [username, setUsername] = useState('');
  const [userPic, setUserPic] = useState(null);
  const [currentLikes, setCurrentLikes] = useState(initialLikes);
  console.log('initial likes is: ' + initialLikes);
  console.log(currentUsers);
  const toggleLike = async () => {

    setLike(previousState => !previousState)
    if (!usersLiked.includes(auth.currentUser.uid)) {
      await updateDoc(postRef, {
        likes: increment(1),
        usersLiked: arrayUnion(auth.currentUser.uid)
      }).then(console.log('added one like!'));
      
      setCurrentLikes(currentLikes + 1);
    } else {
      await updateDoc(postRef, {
        likes: increment(-1),
        usersLiked: arrayRemove(auth.currentUser.uid),
      }).then(console.log('removed one like!'));
      setCurrentLikes(currentLikes - 1);
    }
  };

  const findUsername = async () => {
    const findUsername = (await getDoc(doc(db, 'users', user))).data();
    setUsername(findUsername.username);
    if (findUsername.profilePic) {
      setUserPic(findUsername.profilePic);
    }
  }

  useEffect(() => {
    findUsername();
  }, [user]);

  return (
  <View style={styles.postContainer}>

    <View style={styles.post}>

      <View style={styles.postHeaderContainer}>
        <Image resizeMode='auto' source={userPic === null ? placeholder : {uri: userPic}} style={styles.profileImage}/>
        <View style={styles.postHeader}>
          <Text style={styles.postText}>{username}</Text>
          <Text style={styles.postTime}>{timeAgo.format(Date.now() - (Date.now() - time))}</Text>
        </View>
      </View>

      <Image
        style={styles.image}
        source={{ uri: image }}
      />

      <View style={styles.likeCommentContainer}>
        <Text style={styles.likes}>
          <Text>{usersLiked.length}</Text>
          <Text>{usersLiked.length === 1 ? ' like' : ' likes'}</Text>
        </Text>

        <Text style={{fontSize: 18}}>
          <Text style={{fontWeight: "bold"}}>{username}</Text>
          <Text> {caption}</Text>
        </Text>
        <View style={{marginLeft: 10}}>
          {comments.slice(0, 2).map( (item, id) => {
            return (
              <Result userId={item.userId} commentText={item.commentText} />
            )
          })}
        </View>
      </View>
      <View style={styles.postBottom}>
        <AntDesign.Button name={like ? 'like1' : 'like2'} backgroundColor="#FFFFFF" 
        color= '#EC6337' size = {30} onPress = {toggleLike} activeOpacity = {1} style={{paddingEnd: 0}}>
        </AntDesign.Button>
        <AntDesign.Button name="message1" backgroundColor="#FFFFFF" 
        color= '#EC6337' size = {30} onPress={openComments} activeOpacity = {1} style={{paddingEnd: 0}}>
        </AntDesign.Button>
        <AntDesign.Button name="retweet" backgroundColor="#FFFFFF" 
        color= '#EC6337' size = {30} activeOpacity = {1} style={{paddingEnd: 0}}>
        </AntDesign.Button>
      </View>
      <Comments isVisible={modalVisible} onClose={closeComments} commentsContent={comments} postRef={postRef} />
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
              <FlatList
              style={styles.flatList}
              data={filteredPosts}
              ListEmptyComponent={EmptyList}
              contentContainerStyle={styles.flatListContainer}
              renderItem={({ item }) => {
                return (
                <Post
                  id={item.postId}
                  user={item.userId}
                  time={item.timestamp}
                  image={item.imageURL}
                  caption={item.caption}
                  comments={item.comments}
                  likes={item.likes}
                  usersLiked={item.usersLiked}
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
  },
  headerContainer: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#EC6337',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: {
    display: 'flex',
    backgroundColor: '#F4F4F6',
  },
  post: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20,
  },
  image: {
      width: 320,
      height: 320,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
  },
  headerText: {
    marginTop: 5,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  feed: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  postHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
    marginHorizontal: 15,
  },
  profileImage: {
    width: 40,
    margin: 'auto 0',
    aspectRatio: 1,
    borderRadius: 999,
  },
  postHeader: {
    display: 'flex',
    paddingLeft: 5,
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
  likeCommentContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  postBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
    borderTopColor: '#D4D4D6',
    borderTopWidth: 1,
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
  likes: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentUsername: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentText: {
      fontSize: 16,
  },
});