import Button from "./Button";

export default function NewPostButton(props: { handler: () => void }) {
  return (
    <Button onClick={props.handler} className="hidden min-[1228px]:flex">
      <i className="bi bi-pencil-square mr-2 text-xl"></i>
      <span>New Post</span>
    </Button>
  );
}
