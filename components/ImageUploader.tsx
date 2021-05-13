import React, { useState } from "react";
import { auth, storage, STATE_CHANGED } from "../lib/firebase";
import Loader from "./Loader";

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");

  const uploadFile = async (e) => {
    const file: any = Array.from(e.target.files)[0];
    const extension = file.type.split("/")[1];

    const ref = storage.ref(
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);
    //rozpoczecie uploadu
    const task = ref.put(file);

    //nasluchiwanie na status uploadu
    task.on(
      STATE_CHANGED,
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(pct);
      },
      (error) => {
        console.log(error);
      },
      () => {
        task.snapshot.ref.getDownloadURL().then((url) => {
          setDownloadURL(url);
          setUploading(false);
        });
      }
    );
  };


  return (
    <div>
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}
      {!uploading && (
        <>
          <label>
            upload img
            <input
              type="file"
              accept="image/x-png,image/gif,image/jpeg"
              onChange={uploadFile}
            />
          </label>
        </>
      )}
      {downloadURL && <code>{`![alt](${downloadURL})`}</code>}
    </div>
  );
}
