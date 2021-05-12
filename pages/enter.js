import {googleAuthProvider} from "../lib/firebase";
import {auth} from '../lib/firebase'
import {useContext} from "react";
import {UserContext} from "../lib/context";

export default function EnterPage({}) {
    const { user, username } = useContext(UserContext)
  return (
    <main>
        {user ?
            (!username ? <UsernameForm/> : <SignOutButton/>):<SignInButton/>}
    </main>
  );
}

function SignInButton(){
    const signInWithGoogle = async () => {
        try{
            await auth.signInWithPopup(googleAuthProvider)
        }
       catch (e) {
           console.log(e)
       }
    }

    return (
        <button className={'btn-google'} onClick={signInWithGoogle}>Sign in</button>
    )

}

function SignOutButton(){
    return <button onClick={()=>auth.signOut()}>Sign out</button>
}

function UsernameForm(){
    return <div>user</div>
}