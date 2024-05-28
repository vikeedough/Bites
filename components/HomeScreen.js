import React, {useState} from 'react';
import { Text, View, StyleSheet, FlatList, Image } from "react-native";
import { Header } from 'react-native/Libraries/NewAppScreen';
import AntDesign from '@expo/vector-icons/AntDesign'

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
  caption: 'hahahaha i\'m gay',
  comments: [{
    user: 'neeeegel',
    text: 'hahahaha me too',
    id: 1,
  }, {
    user: 'deseansoh',
    text: 'wtf man',
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

const Post = ({ user, time, image, caption, comments }) => {
  const [like, setLike] = useState(false)
  const toggleLike = () => setLike(previousState => !previousState);

  return (
  <View style={styles.post}>
    <View style={styles.postHeader}>
      <Text style={styles.postText}>{user}</Text>
      <Text style={styles.postTime}>{time}</Text>
    </View>
    <Image
      style={{
        width: 330,
        height: 330,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
      }}
      source={image}
    />
    <Text style={{fontSize: 18}}>
      <Text style={{fontWeight: "bold"}}>{user}</Text>
      <Text> {caption}</Text>
    </Text>
    <View>
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
      <AntDesign.Button name={like ? 'like1' : 'like2'} backgroundColor="#ecf0f1" 
      color= '#000000' size = {30} onPress = {toggleLike} activeOpacity = {1}>
      </AntDesign.Button>
      <AntDesign.Button name="message1" backgroundColor="#ecf0f1" 
      color= '#000000' size = {30}>
      </AntDesign.Button>
      <AntDesign.Button name="retweet" backgroundColor="#ecf0f1" 
      color= '#000000' size = {30}>
      </AntDesign.Button>
    </View>
  </View>
)};

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Bites</Text>
      </View>
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
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 5,
  },
  post: {
    flex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  header: {
    flex: 1,
    marginTop: 20,
    marginLeft: 20,
  },
  headerText: {
    marginTop: 5,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  feed: {
    flex: 10,
  },
  postHeader: {
    flex: 2,
  },
  imageContainer: {
    flex: 8,
  },
  postText: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  postTime: {
    marginLeft: 10,
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'left',
  },
  postBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});