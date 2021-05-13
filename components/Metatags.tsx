import Head from "next/head";

import React from "react";

interface IMetaTagsProps {
  title: string;
  description?: string;
  image?: string;
}

export default function MetaTags({
  title,
  description,
  image,
}: IMetaTagsProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:site" content="@karolwalasik" />
    </Head>
  );
}
