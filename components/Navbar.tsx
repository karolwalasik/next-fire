import Link from "next/link";
import { UserContext } from "../lib/context";
import { useContext } from "react";

export default function Navbar() {
  const { user, username } = useContext(UserContext);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button>feed</button>
          </Link>
        </li>
        {username && (
          <>
            <li>
              <Link href="/admin">
                <button>Write posts</button>
              </Link>
            </li>
            <li>
              <Link href={'/admin/exercises'}>
                <button>My exercises</button>
              </Link>
            </li>
            <li>
              <Link href={'/admin/messages'}>
                <button>Messages</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL} />
              </Link>
            </li>

          </>
        )}
        {!username && (
          <li>
            <Link href="/enter">
              <button>Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
