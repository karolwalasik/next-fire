import React from "react";
import Link from "next/link";
export default function PostFeed({ posts, admin }) {
  return posts
    ? posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null;
}

interface IPostItemProps {
  post: any;
  admin?: boolean;
}

function PostItem({ post, admin = false }: IPostItemProps) {
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>
      <Link href={`/${post.username}/${post.slug}`}>
        <h2>
          <a>{post.title}</a>
          {admin}
        </h2>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span> {` ♡${post.heartCount} Hearts`}</span>
      </footer>
    </div>
  );
}
