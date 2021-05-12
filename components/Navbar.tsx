import Link from "next/link";
import {UserContext} from "../lib/context";
import {useContext} from "react";

export default function Navbar() {
  const { user, username } = useContext(UserContext)

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
                <button>write posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoUrl} />
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
