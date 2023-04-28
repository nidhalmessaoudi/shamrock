import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.4/font/bootstrap-icons.css"
        />
      </Head>
      <body className="bg-white dark:bg-slate-800">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
