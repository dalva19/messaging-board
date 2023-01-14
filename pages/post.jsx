import {auth, db} from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';

export default function Post () {
  // form state
  const postRef = useRef();

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    console.log(postRef.current.value)
  }

  // console.log(postRef.current.value)

  // const [post, setPost] = useState()
  return (
    <div className='my-20 p-10 shadow-lg rounded-lg max-w-xl mx-auto'>
      <form action="" onSubmit={handleFormSubmit}>
        <h1 className='text-2xl font-bold'>Create a new post</h1>

        <div className='py-2'>
          <h3 className='text-lg font-medium py-2'>Description</h3>
          <textarea 
            className='h-48 w-full border-solid border-2 border-gray-700 p-2 text-sm rounded-lg' 
            ref={postRef}></textarea>
          {/* <p>0/300</p> */}
        </div>

        <button type="submit" className='w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm'>Submit</button>
      </form>
    </div>
  )
}