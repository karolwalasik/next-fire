import Head from "next/head";
import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { firestore, postToJSON, fromMillis } from "../lib/firebase";
import PostFeed from "../components/PostFeed";
const LIMIT = 1;

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup("posts")
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts },
  };
}

function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor =
      typeof last?.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;

    const query = firestore
      .collectionGroup("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <PostFeed posts={posts} admin={false} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />
      {postsEnd && "You have reached the end!"}
    </main>
  );
}

// return (
//   <div className={styles.container}>
//     <button onClick={() => toast.success("hello")}>hello</button>
//     <Loader show={true} />
//     <Link
//       prefetch={true}
//       href={{ pathname: "/[username]", query: { username: "jeff" } }}
//     >
//       link
//     </Link>
//   </div>
// );

export default Home;
