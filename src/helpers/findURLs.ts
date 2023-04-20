import isURL from "validator/lib/isURL";

export default function findURLs(
  str: string,
  minify?: boolean,
  linkStyles?: string
) {
  const urls = str
    .split(" ")
    .map((entry) => entry.trim())
    .filter((entry) => {
      return isURL(entry, { protocols: ["http", "https"] });
    });

  console.log(urls);

  let markup = str;
  urls.forEach((url) => {
    const link = url.startsWith("http") ? url : "http://" + url;

    let linkElement;
    if (minify) {
      linkElement = `<a href="${link}" title="${link}" ${
        linkStyles ? `class="${linkStyles}"` : ""
      }>${minifyUrl(url)}</a>`;
    } else {
      linkElement = `<span class="text-blue-400">${url}</span>`;
    }

    markup = markup.replace(url, linkElement);
  });

  return markup;
}

function minifyUrl(url: string) {
  const MAX_URL_LENGTH = 28;
  if (url.length <= MAX_URL_LENGTH) {
    return url;
  }

  return url.substring(0, MAX_URL_LENGTH) + "...";
}
