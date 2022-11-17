import { useEffect, useState } from "react";

import __supabase from "../lib/$supabase";
import { useRouter } from "next/router";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const getUser = async () => {
    const { data } = await __supabase.auth.getUser();

    if (data) {
      setUser(data.user);
      return;
    }

    router.push("/");
  };

  const signOutUser = async () => {
    await __supabase.auth.signOut();
    setUser(null);

    router.push("/");
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      {user && (
        <main>
          <h1 className="text-3xl">Profile Page</h1>
          <p className="text-xl mt-10">Welcome, {user?.email.split("@")[0]}</p>

          <label className="btn btn-error mt-10 butt" htmlFor="signout-modal">
            Sign Out
          </label>
        </main>
      )}

      {/* sign out modal */}
      <input type="checkbox" id="signout-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h1 className="text-lg mb-10">
            Are you sure you want to sign out, {user?.email.split("@")[0]}?
          </h1>
          <label onClick={() => signOutUser()} className="btn btn-error">
            Sign Out
          </label>
          <label htmlFor="signout-modal" className="btn btn-ghost">
            Cancel
          </label>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
