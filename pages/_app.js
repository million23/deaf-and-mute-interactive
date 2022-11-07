import "../styles/globals.css";

import Navbar from "../components/Navbar";
import { Provider } from "urql";
import { Toaster } from "react-hot-toast";
import __urqlClient from "../lib/$urqlClient";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Provider value={__urqlClient}>
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
      </Provider>
    </>
  );
}

export default MyApp;
