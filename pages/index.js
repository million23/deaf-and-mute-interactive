import Link from "next/link";

const Home = (e) => {
  return (
    <>
      <div className="absolute w-full h-screen top-0 left-0 -z-10 overflow-hidden">
        <img
          className="w-full h-full overflow-hidden object-cover absolute top-0 left-0 object-center opacity-50"
          src="https://images.pexels.com/photos/7516578/pexels-photo-7516578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Home"
        />
      </div>

      <main className="min-h-screen flex flex-col justify-center items-center z-[10]">
        <h1 className="text-5xl font-bold mb-10">
          Deaf &amp; Mute Interactive
        </h1>
        <p className="mb-5">What are you waiting for?</p>
        <div className="w-full max-w-md grid grid-cols-1 md:grid-cols-2 gap-2">
          <Link href="/login" className="w-full">
            <button className="btn btn-ghost w-full">Sign In</button>
          </Link>
          <Link href="/signup" className="w-full">
            <button className="btn btn-primary w-full">Sign Up</button>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;
