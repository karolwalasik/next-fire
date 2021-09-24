import React, { useContext, useState } from "react";
import AuthCheck from "../../../components/AuthCheck";
import MetaTags from "../../../components/Metatags";
import kebabCase from "lodash.kebabcase";
import { firestore, auth, serverTimestamp } from "../../../lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import PostFeed from "../../../components/PostFeed";
import { useRouter } from "next/router";
import { UserContext } from "../../../lib/context";
import { formatWithValidation } from "next/dist/next-server/lib/utils";
import toast from "react-hot-toast";
import ExerciseListViewer from "../../../components/ExerciseListViewer";
import { Button } from "@material-ui/core";
export default function AdminExercisePage({}) {
  return (
    <main>
      <MetaTags title="admin exercise page" />
      <AuthCheck>
        <ExercisesList />
        <CreateNewExercise />
      </AuthCheck>
    </main>
  );
}

function ExercisesList() {
  const ref = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("exercises");
  const query = ref.orderBy("createdAt");

  // hook do czytania kolekcji w realtime
  const [querySnapshot] = useCollection(query);
  const exercises = querySnapshot?.docs.map((doc) => doc.data());
  //mozna rownie dobrze uzyc useCollectionData i wyciagnac posty

  return (
    <>
      <h1>Manage your exercises library</h1>
      <ExerciseListViewer exercises={exercises} />
    </>
  );
}

function CreateNewExercise() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  //encode usuwa znaki ?!/
  const slug = encodeURI(kebabCase(title));

  const isValid = title.length > 3 && title.length < 100;

  const createExercise = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = firestore.collection("users").doc(uid).collection("exercises");
    const data = {
      title,
      slug,
      uid,
      content: "hello",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await ref.doc(slug).set(data);
    toast.success("created");

    router.push(`/admin/exercises/${slug}`);
  };

  return (
    <div>
      <form onSubmit={createExercise}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Exercise title"
        />
        <p>
          <strong>Slug:</strong> {slug}
        </p>
        <Button color={"primary"} variant={"contained"} type="submit" disabled={!isValid}>
          Create new exercise
        </Button>
      </form>
    </div>
  );
}
