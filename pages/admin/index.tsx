import React, { useContext, useState } from "react";
import AuthCheck from "../../components/AuthCheck";
import MetaTags from "../../components/Metatags";
import kebabCase from "lodash.kebabcase";
import { firestore, auth, serverTimestamp } from "../../lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import PostFeed from "../../components/PostFeed";
import { useRouter } from "next/router";
import { UserContext } from "../../lib/context";
import { formatWithValidation } from "next/dist/next-server/lib/utils";
import toast from "react-hot-toast";
import { Typography } from "@material-ui/core";
export default function AdminPostsPage({}) {
  return (
    <main>
      <MetaTags title="admin page" />
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const ref = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts");
  const query = ref.orderBy("createdAt");

  // hook do czytania kolekcji w realtime
  const [querySnapshot] = useCollection(query);
  const posts = querySnapshot?.docs.map((doc) => doc.data());
  //mozna rownie dobrze uzyc useCollectionData i wyciagnac posty

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  //encode usuwa znaki ?!/
  const slug = encodeURI(kebabCase(title));

  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = firestore.collection("users").doc(uid).collection("posts");
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "hello",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await ref.doc(slug).set(data);
    toast.success("created");

    router.push(`/admin/${slug}`);
  };

  return (
    <div>
      <form onSubmit={createPost}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title"
        />
        <Typography>
          <strong>Slug:</strong> {slug}
        </Typography>
        <button type="submit" disabled={!isValid}>
          Create new post
        </button>
      </form>
    </div>
  );
}
