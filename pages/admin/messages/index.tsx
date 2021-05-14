import AuthCheck from "../../../components/AuthCheck";
import React, {useState} from "react";
import {firestore,auth} from "../../../lib/firebase";
import {useCollectionData} from "react-firebase-hooks/firestore";
import firebase from "firebase";

export default function MessagesPage({}) {
    const messagesRef = firestore.collection('messages')
    const query = messagesRef.orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(query,{idField:'id'})
    const [formValue,setFormValue] = useState('')

    const sendMessage = async(e) => {
        e.preventDefault();
        const {uid,photoURL} = auth.currentUser

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL
        })

        setFormValue('')
    }

    return (
        <main>
            <AuthCheck>
                <div >
                    {messages && messages.map(msg=><ChatMessage key={msg.id} message={msg} />)}
                </div>
                <form onSubmit={sendMessage}>
                    <input value={formValue} onChange={e=>setFormValue(e.target.value)} type="text"/>
                    <button type="submit">Send</button>
                </form>
            </AuthCheck>
        </main>
    );
}

function ChatMessage(props){
    const {text,uid,photoURL} = props.message;
    const messageClass = uid ===auth.currentUser.uid;

    return <div style={{'display':'flex','marginBottom':'20px','alignItems':'center'}}><img style={{'width':'40px','height':'40px','borderRadius':'50%','marginRight':'20px'}}src={photoURL}/><p style={messageClass? {'color':'red'}:null}>{text}</p></div>

}