import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {Toaster} from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId="685778127383-60ctmcmutcmv7ecp59gmon5gt9jmn57p.apps.googleusercontent.com">
      <Component {...pageProps} />
      <Toaster />
    </GoogleOAuthProvider>
  );
}