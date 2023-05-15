export default function Footer() {
  return (
    <footer className="flex w-[18rem] flex-row flex-wrap items-center gap-x-4 gap-y-2 break-words px-6 text-sm text-black/70 dark:text-slate-400 xl:w-[20rem] min-[1728px]:w-[24rem]">
      <p>Terms of service</p>
      <p>Privacy Policy</p>
      <p>
        © {new Date().getFullYear()} Shamrock.site. Designed and developed by{" "}
        <a
          href="https://www.fiverr.com/nidhalmessaoudi"
          target="_blank"
          referrerPolicy="no-referrer"
          className="hover:underline"
        >
          Nidhal Messaoudi
        </a>
        .
      </p>
    </footer>
  );
}
