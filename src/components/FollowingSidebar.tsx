import truncateUsername from "@/helpers/truncateUsername";
import DefaultProfilePicture from "./DefaultProfilePicture";
import Sidebar from "./Sidebar";

export default function FollowingSidebar() {
  function renderFollowing() {
    const DUMMY_USERNAMES = [
      "division_bell0000",
      "david___gilmour_ftwww",
      "bunch",
      "heavily",
      "present",
      "cardamom",
    ];

    return (
      <>
        {DUMMY_USERNAMES.map((username, i) => (
          <div
            key={i}
            className="flex cursor-pointer flex-row items-center rounded-xl p-2 transition-colors hover:bg-gray-200 dark:hover:bg-slate-600"
            title={username}
          >
            <DefaultProfilePicture className="w-14" />
            <span className="ml-2 font-bold hover:underline">
              {truncateUsername(username)}
            </span>
          </div>
        ))}
      </>
    );
  }

  return (
    <Sidebar title="Following">
      <div className="px-1 pb-1">{renderFollowing()}</div>
    </Sidebar>
  );
}
