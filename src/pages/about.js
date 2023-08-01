import { getStore } from '../async-store';
export default function About() {
  return (
    <div>
      <h1>About</h1>
      <p>This is the about page</p>
    </div>
  );
}

export function getServerSideProps(context) {
  const { res } = context;

  const store = getStore();

  console.log('ABOUT store', store);
  console.log('ABOUT res.locals.foo', res.locals.foo);

  // Pass data to the page via props
  return { props: { foo: 'bar' } };
}
