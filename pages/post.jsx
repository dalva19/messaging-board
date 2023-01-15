import {auth, db} from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import {toast} from 'react-toastify';

export default function Post () {
  // form state
  const postRef = useRef();
  const [post, setPost] = useState({description: ""})
  const [user, loading] = useAuthState(auth);
  const route = useRouter();


  const handleFormSubmit = async (e) => {
    e.preventDefault()
    // run checks for post
    if (!post.description){ 
      toast.error('Description Field empty', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500
      });
      return
    }

    if (post.description.length > 300){ 
      toast.error('Description too long!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500
      });
      return
    }
    // make a new post
    // const userRef = collection(db, 'user', userDoc.id, 'posts');
    const collectionRef = collection(db, 'posts');
    
    try {
      await addDoc(collectionRef, {
        ...post, 
        'timestamp': serverTimestamp(),
        user: user.uid, 
        avatar: user.photoURL,
        username: user.displayName
      });
      setPost({description: ''})
      return route.push('/')
    } catch(err) {
      toast.error(`${err}`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500
      });
    }
  };

  return (
    <div className='my-20 p-10 shadow-lg rounded-lg max-w-xl mx-auto'>
      <form action="" onSubmit={handleFormSubmit}>
        <h1 className='text-2xl font-bold'>Create a new post</h1>

        <div className='py-2'>
          <h3 className='text-lg font-medium py-2'>Description</h3>
          <textarea 
            className='h-48 w-full border-solid border-2 border-gray-700 p-2 text-sm rounded-lg' 
            ref={postRef} 
            value={post.description}
            onChange={(e) => setPost({...post, description: e.target.value}) }
            />
          <p 
          className={`${post.description.length < 300 ? "text-cyan-600" : "text-red-500" } font-medium text-sm`}>
            {post.description.length}/300
          </p>
        </div>

        <button type="submit" className='w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm'>Submit</button>
      </form>
    </div>
  )
}