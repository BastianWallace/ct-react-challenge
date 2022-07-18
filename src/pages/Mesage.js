import React, { useRef } from 'react';
import { db } from '../firebase-config';
import { addDoc, collection } from '@firebase/firestore';

const Message = () => {
  const messageRef = useRef();
  const ref = collection(db, 'messages');

  const handleSave = async (e) => {
    e.preventDefault();
    console.log(messageRef.current.value);

    let data = {
      message: messageRef.current.value
    }

    try {
      addDoc(ref, data);
    
    } catch(e) {
      console.log(e);
    }
  };

  return (
    <div>
      <form onSubmit={handleSave}>
        <label>Enter message</label>
        <input type="text" ref={messageRef}></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Message;
