import {auth, db} from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import {toast} from 'react-toastify';

export default function Post () {
  // form state
  const postRef = useRef();
  const [post, setPost] = useState({description: ""})
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;

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

    // check if editing
    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = {...post, 'timestamp': serverTimestamp()};
      await updateDoc(docRef, updatedPost);
      toast.success('Post has been made!', {position: toast.POSITION.TOP_CENTER, autoClose: 1500});
      return route.push("/")
    } {
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
      setPost({description: ''});
      toast.success('Post has been made!', {position: toast.POSITION.TOP_CENTER, autoClose: 1500});
      return route.push('/');
    } catch(err) {
      toast.error(`${err}`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500
      });
    }
    }
  };

  //check user
  const checkUser = async () => {
    if(loading) return
    if(!user) route.push('/auth/login');
    if (routeData.id) {
      setPost({description: routeData.description, id: routeData.id});
    }
  }

  useEffect(() => {
    checkUser()
  }, [user, loading])

  return (
    <div className='my-20 p-10 shadow-lg rounded-lg max-w-xl mx-auto'>
      <form action="" onSubmit={handleFormSubmit}>
        <h1 className='text-2xl font-bold'>
          {post?.hasOwnProperty("id") ? 'Update your post' : 'Create a new post'}
        </h1>

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