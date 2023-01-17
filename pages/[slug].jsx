import Message from "@/components/message";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import {auth, db} from '../utils/firebase';
import {toast} from 'react-toastify';
import { arrayUnion, doc, getDoc,  onSnapshot,  Timestamp, updateDoc } from "firebase/firestore";

export default function Details () {
  const router = useRouter();
  const routeData = router.query;
  const [comments, setAllComments] = useState([]);
  const commentRef = useRef();
  //submit comment message
  const submitComment = async () => {
    // check if user is logged in
    if(!auth.currentUser) return router.push('/auth/login');

    if(!commentRef.current.value){ 
      toast.error("Don't leave an empty message!", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1500
    });
    return;
  };

  const docRef = doc(db, "posts", routeData.id);
  await updateDoc(docRef, {
    comments: arrayUnion({
      message: commentRef.current.value,
      avatar: auth.currentUser.photoURL, 
      username: auth.currentUser.displayName,
      time: Timestamp.now()
    })
  });

  };

  // get comments
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllComments(snapshot.data().comments);
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);

  return (
    <div>
      <div>
      <Message {...routeData}></Message>
        <div className="flex my-2">
          <input 
          ref={commentRef}
          type="text"
          placeholder="Send a message" 
          // onChange={(e) => setMessage(e.target.value)}
          className="bg-gray-800 w-full p-2 text-white text-sm"/>
          <button className="bg-cyan-500 text-white py-2 px-4 text-sm" onClick={submitComment}>Submit</button>
        </div>

        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {comments?.map((comment) => (
            <div className="bg-white p-4 my-4 border-2" key={comment.time}>
              <div className="flex items-center gap-2 mb-4">
                <img  className="w-10 rounded-full" src={comment.avatar} alt="" />
                <h2>{comment.username}</h2>
              </div>
              <h2>{comment.message}</h2>
              {/* <h3>{comment.time}</h3> */}
            </div>
          ))}
        </div>
      </div>
      
    </div>
  )
};