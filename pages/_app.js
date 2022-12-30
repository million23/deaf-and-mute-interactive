import "../styles/globals.css";

import Navbar from "../components/Navbar";
import { Provider as SupabaseProvider } from "react-supabase";
import { Toaster } from "react-hot-toast";
import { Provider as UrqlProvider } from "urql";
import __supabase from "../lib/$supabase";
import __urqlClient from "../lib/$urqlClient";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <SupabaseProvider value={__supabase}>
        <UrqlProvider value={__urqlClient}>
          <>
            <Navbar />
            <section className="w-full max-w-5xl mx-auto px-5 lg:px-0">
              <Component {...pageProps} />
            </section>

            <Toaster
              position="bottom-right"
              toastOptions={{
                className: "",
              }}
            />
          </>
        </UrqlProvider>
      </SupabaseProvider>
    </>
  );
}

export default MyApp;
