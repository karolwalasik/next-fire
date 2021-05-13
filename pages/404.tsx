import Link from "next/link";
import React from "react";

export default function Custom404() {
  return (
    <>
      <p>404 not found</p>

      <Link href="/">
        <button>go back</button>
      </Link>
    </>
  );
}
