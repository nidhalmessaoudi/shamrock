import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import { Poppins } from "next/font/google";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "next-themes";
import useScrollRestoration from "@/hooks/useScrollRestoration";

const poppins = Poppins({
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps, router }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  useScrollRestoration(router);

  return (
    <ThemeProvider attribute="class">
      <QueryClientProvider client={queryClient}>
        <main className={poppins.className}>
          <Component {...pageProps} />
        </main>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
