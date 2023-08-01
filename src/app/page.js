import { emoji } from "@/utils";
import Link from "next/link";
import { getStore } from "../async-store";

export default function Home() {
  const store = getStore();

  const { enabled } = globalThis.__ASYNC_STORE;

  console.log("APP INDEX store", store);
  console.log("APP INDEX AsyncLocalStorage instance enabled", enabled);

  return (
    <div>
      <h1>
        Index page: <code style={{ color: "green" }}>app</code> router
      </h1>
      <Link href="/about">Go to the About page, see the pages directory</Link>
      <p>
        AsyncLocalStorage store value is {String(store)} {emoji(store)}
      </p>
      <p>
        Is AsyncLocalStorage instance enabled? {String(enabled)} {emoji(store)}
      </p>
    </div>
  );
}
