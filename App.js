import React, { useState, useRef, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { Header, Input } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';

const Post = ({ imageUri, title, creator, creatorImage, commentsList }) => {
  const [commentsVisible, setCommentsVisible] = useState(false);
  const commentsHeight = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;


  const toggleComments = () => {
    if (!commentsVisible) {
      setCommentsVisible(true);
      Animated.timing(rotation, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
  
      Animated.timing(commentsHeight, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(rotation, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
  
      Animated.timing(commentsHeight, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(() => setCommentsVisible(false));
    }
  };
  

  const commentsTotalHeight = useMemo(() => {
    return 16 + 8 + commentsList.length * 65;
  }, [commentsList]);

  return (
    <View style={styles.postContainer}>
      <View style={styles.postTitleContainer}>
        <Text style={styles.postTitle}>{title}</Text>
        <TouchableOpacity style={styles.replyButton}>
          <FontAwesome name="reply" size={20} color="#000000" />
        </TouchableOpacity>
      </View>
      <Image source={{ uri: imageUri }} style={styles.postImage} resizeMode="cover" />
      <View style={styles.postFooter}>
        <Image source={{ uri: creatorImage }} style={styles.creatorImage} />
        <Text style={styles.creatorName}>{creator}</Text>

        <TouchableOpacity onPress={toggleComments} style={styles.commentsToggleButton}>
        <Animated.View
  style={{
    transform: [
      {
        rotate: rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  }}
>
  <FontAwesome name="chevron-down" size={20} color="#800000" />
</Animated.View>

        </TouchableOpacity>

      </View>
      
      <Animated.View
        style={[
          styles.commentsContainer,
          {
            height: commentsHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, commentsTotalHeight],
            }),
          },
        ]}
      >
        <Comments commentsList={commentsList} />
      </Animated.View>
    </View>
  );
};

const Comment = ({ author, text, authorImage, likes }) => {
  return (
    <View style={styles.commentContainer}>
      <Image source={{ uri: authorImage }} style={styles.commentAuthorImage} />
      <View style={styles.commentContent}>
        <Text style={styles.commentAuthor}>{author}</Text>
        <Text style={styles.commentText}>{text}</Text>
      </View>
      <View style={styles.commentActions}>
        <View style={styles.likesContainer}>
          <Text style={styles.likesCounter}>{likes}</Text>
          <TouchableOpacity style={styles.likeButton}>
            <FontAwesome name="heart" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Comments = ({ commentsList }) => {
  return (
    <View>
      <Text style={styles.commentsTitle}>Comments</Text>
      {commentsList.map((comment, index) => (
        <Comment
          key={index}
          author={comment.author}
          authorImage={comment.authorImage}
          text={comment.text}
          likes={comment.likes}
        />
      ))}
    </View>
  );
};

const generatePosts = (n) => {
  const posts = [];

  for (let i = 1; i <= n; i++) {
    const post = {
      imageUri: `https://picsum.photos/seed/post${i}/400/600`,
      title: `Post ${i} Title`,
      creator: `Creator ${i} Name`,
      creatorImage: `https://picsum.photos/seed/creator${i}/40/40`,
      likes: Math.floor(Math.random() * 1000),
      commentsList: [],
    };

    const numComments = Math.floor(Math.random() * 10);

    for (let j = 1; j <= numComments; j++) {
      const comment = {
        author: `Commenter ${j}`,
        authorImage: `https://picsum.photos/seed/commenter${j}/40/40`,
        text: `This is a comment on post ${i}`,
        likes: Math.floor(Math.random() * 100),
      };

      post.commentsList.push(comment);
    }

    posts.push(post);
  }

  return posts;
};

const App = () => {

  const posts = generatePosts(10);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" animated={true} hidden={true} />
      <Header
        centerComponent={{
          text: 'BPM',
          style: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop:36, alignSelf:"center"},
          numberOfLines: 1
        }}

        containerStyle={{
          backgroundColor: '#800000',
        }}


        leftComponent={
          <TouchableOpacity>
            <FontAwesome name="search" size={20} color="white" marginLeft={16} marginTop={36}/>
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={styles.mainContent}>
        <Text style={styles.heading}>Your Feed</Text>
        {/* Add your content here */}
        {/* Make a list of n posts */}
        {posts.map((post, index) => (
          <Post
            key={index}
            imageUri={post.imageUri}
            title={post.title}
            creator={post.creator}
            creatorImage={post.creatorImage}
            likes={post.likes}
            commentsList={post.commentsList}
          />
        ))}

        {/* Add more posts here */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  // ... (previous styles)

  commentsToggleButton: {
    alignSelf: 'center',
    marginRight: 16,
    marginLeft: 175
  },
  commentsToggleButtonText: {
    fontSize: 14,
    color: '#800000',
    textDecorationLine: 'underline',
  },
  container: {
    flex: 1,
    backgroundColor: '#202020',
  },
  mainContent: {
    padding: 12,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  postContainer: {
    marginBottom: 24,
  },
  postTitleContainer: {
    flexDirection: 'row', // Add this line to make the container a row
    alignItems: 'center', // Add this line to align the items vertically
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  postTitle: {
    flex: 1, // Add this line to make the title take up the available space
    fontSize: 16,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#0f0f0f',
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    // borderBottomLeftRadius: 8,
    // borderBottomRightRadius: 8,
  },
  creatorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3f3f3f',
  },
  creatorName: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentsContainer: {
    backgroundColor: '#2f2f2f',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  comment: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
    marginLeft: 5,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  commentAuthorImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3f3f3f',
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  commentText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  commentActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 4,
  },
  likeButton: {
    marginLeft: 12, // Change marginRight to marginLeft
  },
  likesCounter: {
    alignSelf: 'flex-end',
    color: '#ffffff',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyButton: {
    marginRight: 16, // Add this line to add space between the title and the button
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  moreButton: {
    flexDirection: 'row', // Add this line to make the container a row
    alignItems: 'center', // Add this line to align the items vertically
  },
  
});

export default App;

