import Link from "next/link"
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from "../utils/firebase";
import {FaUserAlt} from 'react-icons/ai'
import Image from "next/image";

export default function Nav () {
  const [user, loading] = useAuthState(auth);

  return (
   <nav className="flex justify-between items-center py-10">
    <Link href={"/"}>
      <button className="text-lg font-medium">Thoughts</button>
    </Link>

    <ul className="flex items-center gap-10">
      {user ? (
        <div className="flex items-center gap-6">
             <Link href={"/post"} className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8">
             <button className="font-medium bg-cyan-500 text-white rounded text-sm">Post</button>
            </Link>
            <Link href={"/dashboard"}>
              {/* <Image className="w-12 rounded-full cursor-pointer" src={user.photoURL} alt="" width={} /> */}
              {user.photoURL ? (
                 <img className="w-12 rounded-full cursor-pointer" src={user.photoURL} alt="" />
              ): (
                <FaUserAlt />
              )}
            
            </Link>
            </div>
      ): (
        <Link href={"/auth/login"} className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8">
        Join Now
       </Link>
      )}
      
    </ul>
   </nav>
  )
}