export default function Footer() {
  return (
    <footer className="flex w-[24rem] flex-row flex-wrap items-center gap-x-4 gap-y-2 break-words px-6 text-sm text-black/70 dark:text-slate-400">
      <p>Terms of service</p>
      <p>Privacy Policy</p>
      <p>
        © {new Date().getFullYear()} Shamrock.site. All rights are reserved.
      </p>
    </footer>
  );
}
