import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import useScrollRestoration from "@/hooks/useScrollRestoration";

const poppins = Poppins({
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps, router }: AppProps) {
  useScrollRestoration(router);

  return (
    <ThemeProvider attribute="class">
      <main className={poppins.className}>
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  );
}
