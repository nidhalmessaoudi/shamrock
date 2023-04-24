export default function truncateUsername(username: string) {
  const MAX_LENGTH = 12;
  let truncated = username.substring(0, MAX_LENGTH);
  if (truncated !== username) {
    truncated += "...";
  }
  return truncated;
}
