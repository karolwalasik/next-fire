import Head from "next/head";
import React from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

export default function Home() {
  return (
    <div className={styles.container}>
      <button onClick={() => toast.success("hello")}>hello</button>
      <Loader show={true} />
      <Link
        prefetch={true}
        href={{ pathname: "/[username]", query: { username: "jeff" } }}
      >
        link
      </Link>
    </div>
  );
}
