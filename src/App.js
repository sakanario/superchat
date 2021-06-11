import React, { useState } from 'react';
import './App.css';

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyAO_DleIaWN9MGj8q08EAP0XnlKDN3zE3c",
  authDomain: "superchat-53b66.firebaseapp.com",
  projectId: "superchat-53b66",
  storageBucket: "superchat-53b66.appspot.com",
  messagingSenderId: "1052914990349",
  appId: "1:1052914990349:web:5cefb2394f38edf2fbc444"
})

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <button className="signInButton" onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {

  return(
    <button className="signOut" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(query,{idField:'id'});
  const [formValue,setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid,photoURL} = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
  }

  return (
    <>
      <Nav />
      
      <div className={'messageBox'}> 
        <div className={'innerMessageBox'}>
          {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
        </div>
      </div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        <button type="submit">Kirim</button>
      </form>
    </>
  )

}

function Nav() {
  return(
    <nav>
          <div className="navContainer">
            <h1 className="AppTitle">Simple Chat App</h1>
            <SignOut />
          </div>
    </nav>
  )
  
}

function ChatMessage(props) {
  const {text,uid,photoURL,createdAt} = props.message;
  let date;
  let time
  console.log(createdAt);


  if(createdAt){
    date = createdAt.toDate();
    time = date.getHours() + ":"+date.getMinutes();
  }
  // console.log(date.getHours() + ":"+date.getMinutes());

  const messageClass = uid === auth.currentUser.uid ? 'own' : 'other';
  // const classname = 'message ' + messageClass;

  return (
    <div className="bubbleWrapper">
      <div className={`inlineContainer  ${messageClass}`}>
        <img className="inlineIcon" src={photoURL}/>
        <div className={`${messageClass}Bubble ${messageClass}`}>
        {text}
        </div>
      </div><span className={messageClass}>{time}</span>
    </div>
  )
} 

export default App;
