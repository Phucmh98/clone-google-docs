import Link from "next/link";

const Home = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      Click <Link href="/documents/123">Here</Link>
    </div>
  );
};

export default Home;
