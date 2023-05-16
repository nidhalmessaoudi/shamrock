export default function NewPostButtonCircle(props: { handler: () => void }) {
  return (
    <div
      role="button"
      onClick={props.handler}
      className="fixed bottom-4 right-8 block rounded-full bg-green-blue px-4 py-3 dark:bg-light-green sm:right-32 min-[1228px]:hidden"
    >
      <i className="bi bi-pencil-square text-xl leading-[inherit] text-white"></i>
    </div>
  );
}
