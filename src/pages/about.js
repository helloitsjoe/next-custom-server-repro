import Link from "next/link";
import { getStore } from "../async-store";

export default function About() {
  return (
    <div>
      <h1>
        About page: <code style={{ color: "green" }}>pages</code> directory
      </h1>
      <p>This is the about page</p>
      <Link href="/">Home</Link>
    </div>
  );
}

export function getServerSideProps(context) {
  const { res } = context;

  const store = getStore();

  console.log("PAGES ABOUT res.locals", res.locals);
  console.log("PAGES ABOUT store", store);
  console.log("PAGES ABOUT AsyncLocalStorage", globalThis.ASYNC_STORE);

  return { props: {} };
}
