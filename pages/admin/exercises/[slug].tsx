import styles from "@styles/Admin.module.css";
import AuthCheck from "../../../components/AuthCheck";
import { firestore, auth, serverTimestamp } from "../../../lib/firebase";
import { useState } from "react";
import { useRouter } from "next/router";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import toast from "react-hot-toast";
import ImageUploader from "../../../components/ImageUploader";

export default function AdminExerciseEdit({}) {
  return (
    <AuthCheck>
      <ExerciseManager />
    </AuthCheck>
  );
}

function ExerciseManager() {
  const [preview, setPreview] = useState(false);
  const router = useRouter();
  const { slug }: any = router.query;

  const exerciseRef = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("exercises")
    .doc(slug);
  const [exercise] = useDocumentDataOnce(exerciseRef);

  return (
    <main>
      {exercise && (
        <>
          <section>
            <h1>{exercise.title}</h1>
            <p>ID: {exercise.slug}</p>

            <ExerciseForm
              exerciseRef={exerciseRef}
              defaultValues={exercise}
              preview={preview}
            />
          </section>
          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
          </aside>
        </>
      )}
    </main>
  );
}

function ExerciseForm({ exerciseRef, defaultValues, preview }) {
  const { register, handleSubmit, reset, watch, formState } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty, errors } = formState;

  const updatePost = async ({ content }) => {
    await exerciseRef.update({
      content,
      updatedAt: serverTimestamp(),
    });
    //resetuj walidacje formularza
    reset({ content });
    toast.success("updated");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div>
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}

      <div style={preview ? { display: "none" } : { display: "block" }}>
        <ImageUploader />
        <textarea
          name="content"
          {...register("content", {
            maxLength: { value: 20000, message: "too long" },
            minLength: { value: 5, message: "too short" },
            required: { value: true, message: "no content" },
          })}
        ></textarea>
        {errors?.content && <p>{errors.content.message}</p>}
        <button type="submit" disabled={!isDirty || !isValid}>
          Save
        </button>
      </div>
    </form>
  );
}
