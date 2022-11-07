import Link from "next/link";
import __supabase from "../lib/$supabase";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useRouter } from "next/router";

const SignupPage = () => {
  const router = useRouter();

  const checkUser = async () => {
    const { data } = await __supabase.auth.getUser();
    if (!data) {
      router.push("/");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const inputData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    if (inputData.email == "" || inputData.password == "") {
      toast.error("Please fill in all fields");
      return;
    }

    toast.loading("Signing up...");

    const { error } = await __supabase.auth.signUp(inputData);

    toast.dismiss();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Successfully signed up.");
      toast("Please check your email for a confirmation link.");
      router.push("/login");
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <>
      <main className=" flex flex-col py-28">
        <h1 className="text-center text-4xl font-bold">Sign up an account</h1>

        <form
          onSubmit={(e) => handleSignup(e)}
          className="w-full max-w-lg mx-auto mt-10 gap-5"
        >
          <div className="flex flex-col gap-2 ">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="input input-primary input-bordered"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="input input-primary input-bordered"
            />
          </div>
          <button type="submit" className=" btn btn-primary w-full mt-16">
            Sign Up
          </button>
          <p className="text-sm mt-5">
            After signing up, verify your email address by clicking the link we
            sent to your email.
          </p>

          <p className="flex justify-center gap-2 mt-7">
            Already have an account?{" "}
            <Link href="/login" className="link">
              Login
            </Link>
          </p>
        </form>
      </main>
    </>
  );
};

export default SignupPage;
