import {auth} from '../utils/firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { useEffect, useState} from 'react';
import { collection, doc, onSnapshot, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import Message from '@/components/message';
import {BsTrash2Fill} from 'react-icons/bs';
import { AiFillEdit } from 'react-icons/ai';
import Link from 'next/link';


export default function Dashboard () {
  const route = useRouter(); 
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  console.log('USER', user)

  const getData = async () => {
    const q =  query(collection(db, "posts"), where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe
  };

  const checkUser = async () => {
    if(loading) return
    if(!user) route.push('/auth/login')
  }

  const handleSignOut = () => {
    auth.signOut();
    route.push('/auth/login');
  };

  // delete post
  const handleDeleteButton = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  useEffect(() => {
    checkUser()
    if (user) getData()
    // route.push('/auth/login')
  }, [user, loading])


  return (
    <div>
        <h1>Your Posts</h1>
        <div>
          {posts.map((post) => {   
            return (
            <Message {...post} key={post.uid}>
                <div className='flex gap-4'>
                  <button 
                  className='text-pink-600 flex items-center justify-cente gap-2 py-2  text-small cursor-pointer'
                  onClick={() => handleDeleteButton(post.id)}
                  >
                    <BsTrash2Fill className='text-2xl'/>Delete
                  </button>
                  <Link href={{pathname: "/post", query: post}}>
                    <button className='text-teal-600 flex items-center justify-cente gap-2 py-2  text-small cursor-pointer'>
                     <AiFillEdit className='text-2xl'/>Edit
                      </button>
                    </Link>
                </div>
            </Message>
            )}
          )}
        
        </div>
     
       <button onClick={handleSignOut} className="font-medium text-white bg-gray-800 py-2 px-4 my-6 rounded-md cursor-pointer">Sign Out</button>
     </div>
  )
};