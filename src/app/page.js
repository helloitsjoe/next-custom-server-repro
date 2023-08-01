import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>
        Index page: <code style={{ color: "green" }}>app</code> router
      </h1>
      <p>This is the index page</p>
      <Link href="/">About</Link>
    </div>
  );
}
