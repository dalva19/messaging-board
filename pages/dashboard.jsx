import {auth} from '../utils/firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Dashboard () {
  const route = useRouter(); 
  const [user, loading] = useAuthState(auth);

  // check if user is logged in
  const getData = async () => {
    if (loading) return;
    if(!user) return route.push('/auth/login');
  };

  const handleSignOut = () => {
    auth.signOut();
    route.push('/auth/login')
    // getData()
  };

  return (
    <div>
        <h1>Your Posts</h1>
        <div>posts</div>
       <button onClick={handleSignOut}>Sign Out</button>
     </div>
  )
}