import styles from "@styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import { firestore, auth, serverTimestamp } from "../../lib/firebase";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import toast from "react-hot-toast";
import ImageUploader from "../../components/ImageUploader";
import { Button } from "@material-ui/core";

export default function AdminPostEdit({}) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);
  const router = useRouter();
  const { slug }: any = router.query;

  const postRef = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts")
    .doc(slug);
  const [post] = useDocumentDataOnce(postRef);

  return (
    <main>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>
          <aside>
            <h3>Tools</h3>
            <Button color={"primary"} variant={'outlined'} onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </Button>
            <Link href={`/${post.username}/${post.slug}`}>
              <Button color={"primary"} variant={'outlined'}>Live view</Button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ postRef, defaultValues, preview }) {
  const { register, handleSubmit, reset, watch, formState } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty, errors } = formState;

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    });
    //resetuj walidacje formularza
    reset({ content, published });
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
        <fieldset>
          <input type="checkbox" id="published"name="published" {...register("published")} style={{display:'inline-block',width:'unset'}}/>
          <label htmlFor="published">Published</label>
        </fieldset>
        <Button variant={"contained"} type="submit" disabled={!isDirty || !isValid}>
          Save
        </Button>
      </div>
    </form>
  );
}
