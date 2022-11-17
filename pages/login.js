import { useEffect, useState } from "react";

import Link from "next/link";
import __supabase from "../lib/$supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const LoginPage = () => {
  const [hasUser, setHasUser] = useState(false);
  const router = useRouter();

  const checkUser = async (e) => {
    const res = await __supabase.auth.getUser();
    if (res.data.user) {
      console.log(res.data.user);
      setHasUser(true);
    }
    setTimeout(() => {
      router.push("/");
    }, 5000);
  };

  useEffect(() => {
    checkUser();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const inputData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    // check if email and password are empty
    if (inputData.email == "" || inputData.password == "") {
      toast.error("Please fill in all fields");
      return;
    }
    toast.loading("Logging in...");

    const { error } = await __supabase.auth.signInWithPassword(inputData);

    toast.dismiss();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Successfully logged in.");
      router.push("/");
    }
  };

  if (hasUser) {
    return (
      <>
        <main className="py-16 flex flex-col items-center pt-28">
          <h1 className="text-2xl text-center max-w-xl">You are signed in.</h1>

          <p>Redirecting you to the homepage in 5 seconds...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <main className=" py-28 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Login to your account
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(e);
          }}
          className="w-full max-w-lg mt-10 flex flex-col gap-4 mx-auto"
        >
          <label className="flex flex-col gap-2">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              className="input input-primary input-bordered w-full "
              placeholder="samplemail@mail.com"
              name="email"
            />
          </label>
          <label className="flex flex-col gap-2 ">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              className="input input-primary input-bordered w-full "
              placeholder="Super secret password"
              name="password"
            />
          </label>
          <button type="submit" className="btn btn-primary btn-block mt-10">
            Login
          </button>
          <p className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="signup" className="link">
              Sign up
            </Link>
          </p>
          <span className="text-xs opacity-50">
            By signing in, you agree to our persistent authentication feature
            that will keep you logged in for 30 days.
          </span>
        </form>
      </main>
    </>
  );
};

export default LoginPage;
