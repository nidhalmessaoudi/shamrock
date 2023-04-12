import HeadEl from "next/head";

interface Props {
  title: string;
}

export default function Head(props: Props) {
  return (
    <HeadEl>
      <title>{props.title}</title>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="description"
        content="Pikri.com is a social media platform for sports bettors."
      />
      <link rel="icon" href="/favicon.ico" />
    </HeadEl>
  );
}
