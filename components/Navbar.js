import { useAuthStateChange, useClient } from 'react-supabase'
import { useEffect, useState } from "react";

import Link from "next/link";
import __supabase from "../lib/$supabase";
import { useRouter } from 'next/router';

const Navbar = (e) => {
  const [hasUser, setHasUser] = useState(false);
  const router = useRouter()

  const checkUser = async (e) => {
    const user = await __supabase.auth.getUser()

    if (user.data.user) {
      setHasUser(true);
    }
  };


  useEffect(() => {
    checkUser();
  }, []);

  __supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      setHasUser(false);
      router.push('/')
    }

    if (event === 'SIGNED_IN') {
      setHasUser(true);
    }
  })

  return (
    <>
      {/* navbar */}
      <main className="fixed top-0 flex w-full justify-center bg-[#1b1919] text-primary-content z-[999]">
        <nav className="flex justify-between items-center w-full max-w-5xl lg:px-0 px-5 py-5 text-base">
          <Link href="/" className="cursor-pointer">
            Deaf &amp; Mute Interactive
          </Link>

          {/* desktop links */}
          <div className="lg:flex items-center gap-2 hidden">
            {hasUser && (
              <>
                {/* <button className="btn btn-sm btn-ghost">Home</button>
                <button className="btn btn-sm btn-ghost">Services</button> */}
                <Link href="/tutorials" className="btn btn-sm btn-ghost">
                  Tutorials
                </Link>
                <button
                  onClick={async () => {
                    await __supabase.auth.signOut();
                    setHasUser(false);
                    router.reload()
                  }}
                  className="btn btn-sm btn-ghost"
                >
                  Sign Out
                </button>
              </>
            )}
            {!hasUser && (
              <>
                <Link href="/signup" className="btn btn-sm border-white">
                  Sign Up Now
                </Link>
                <Link href="/login" className="btn btn-sm border-white">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* mobile links */}
          <div className="lg:hidden flex items-center gap-2">
            {!hasUser && (
              <>
                <button className="btn btn-sm border-white">Sign Up Now</button>
                <button className="btn btn-sm border-white">Sign In</button>
              </>
            )}
          </div>
        </nav>
      </main>
    </>
  );
};

export default Navbar;
