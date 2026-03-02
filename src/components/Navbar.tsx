"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();

  const user: User = session?.user as User;

  return (
    <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/80 p-4 backdrop-blur md:p-5">
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 md:flex-row">
        <a href="/" className="text-xl font-semibold tracking-tight">
          Mystery Message
        </a>
        {session ? (
          <div className="flex w-full flex-col items-center gap-2 md:w-auto md:flex-row md:gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.username || user?.email}
            </span>
            <Button onClick={() => signOut()} className="w-full md:w-auto">
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/signin">
            <Button className="w-full md:w-auto">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
