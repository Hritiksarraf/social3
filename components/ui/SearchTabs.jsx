import Link from "next/link";

export default function SearchTabs({ query, active }) {
  const tabClass = (isActive) =>
    `flex-1 text-center py-2.5 rounded-[10px] font-extrabold text-[13px] ${
      isActive ? "text-white" : "text-ink-3"
    }`;

  return (
    <div className="flex bg-surface-1 rounded-2xl p-1 mb-2 max-w-xs">
      <Link
        href={`/search/people/${query}`}
        className={tabClass(active === "people")}
        style={
          active === "people"
            ? { background: "linear-gradient(135deg, #7857FF, #FF0073)" }
            : undefined
        }
      >
        People
      </Link>
      <Link
        href={`/search/posts/${query}`}
        className={tabClass(active === "posts")}
        style={
          active === "posts"
            ? { background: "linear-gradient(135deg, #7857FF, #FF0073)" }
            : undefined
        }
      >
        Posts
      </Link>
    </div>
  );
}
