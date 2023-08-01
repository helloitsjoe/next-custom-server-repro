import { emoji } from "@/utils";
import Link from "next/link";
import { getStore } from "../async-store";

export default function About({ locals, store, enabled }) {
  return (
    <div>
      <h1>
        About page: <code style={{ color: "green" }}>pages</code> directory
      </h1>
      <Link href="/">Go Home, see the app directory</Link>
      <p>
        res.locals value is {String(locals)} {emoji(locals)}
      </p>
      <p>
        AsyncLocalStorage store value is {String(store)} {emoji(store)}
      </p>
      <p>
        Is AsyncLocalStorage instance enabled? {String(enabled)}{" "}
        {emoji(enabled)}
      </p>
    </div>
  );
}

export function getServerSideProps(context) {
  const { res } = context;

  const { locals } = res;
  const { enabled } = globalThis.__ASYNC_STORE;

  const store = getStore();

  console.log("PAGES ABOUT res.locals", locals);
  console.log("PAGES ABOUT store", store);
  console.log("PAGES ABOUT Async Store enabled", enabled);

  return {
    props: {
      locals: locals ? JSON.stringify(locals) : String(locals),
      store: String(store),
      enabled,
    },
  };
}
