import { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, StyleSheet, FlatList,  RefreshControl } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { firebaseAuth, firebaseDb} from '../../firebaseConfig'
import { collection, onSnapshot, doc } from 'firebase/firestore';
import Card from '@/components/Card.js';
import HomeScreenInfo from '@/components/Modals/HomeScreenInfo';

const auth = firebaseAuth;
const db = firebaseDb;

const EmptyList = () => {
  return (
    <View style={styles.emptyList}>
            <Text style={styles.emptyText}>No posts to show. Post a picture or add some friends to see their posts on your feed!</Text>
    </View>
  )
}

export default function HomeScreen({navigation}) {

  const user = auth.currentUser ? auth.currentUser.uid : null;
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [friends, setFriends] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const openInfo = () => {
    setModalVisible(true);
  }

  const closeInfo = () => {
      setModalVisible(false);
  }

  useEffect(() => {

    if (!user) {
      console.error("No user is logged in");
      return;
    }

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
          tags: doc.data().tags || [],
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          testID='helpIcon'
          name="help-circle-outline"
          color={'white'}
          size={24}
          onPress={() => setModalVisible(true)}
        />
      ),
    });
  }, [navigation]);

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
                  tags={item.tags}
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
          <HomeScreenInfo isVisible={modalVisible} onClose={closeInfo}/>
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