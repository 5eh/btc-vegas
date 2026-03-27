import Image from "next/image";
import Link from "next/link";
import { auth, signOut } from "@/app/(auth)/auth";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { History } from "./history";
import { SlashIcon } from "./icons";
import { ThemeToggle } from "./theme-toggle";

export const Navbar = async () => {
  let session = await auth();

  return (
    <>
      <div className="bg-background absolute top-0 left-0 w-full py-2 px-3 justify-between flex flex-row items-center z-30">
        <div className="flex flex-row gap-2 sm:gap-3 items-center">
          <History user={session?.user} />
          <div className="flex flex-row gap-2 items-center">
            <Image src="/images/Logo.png" height={30} width={30} alt="FTW" />
            <div className="text-zinc-500 hidden sm:block">|</div>
            <Link href="/">
              <div className="text-sm hidden sm:block dark:text-zinc-300 truncate w-28 md:w-fit">
                Fund The World
              </div>
            </Link>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-4">
          <Link href={"/all"}>
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg md:rounded-full text-sm text-black dark:text-white border border-primary transition hover:bg-primary/10">
              Organizations
            </button>
          </Link>
        </div>
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg md:rounded-full text-xs sm:text-sm text-black dark:text-white border border-primary transition hover:bg-primary/10 bg-transparent max-w-[140px] sm:max-w-none truncate"
                variant="secondary"
              >
                {session.user?.email}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <ThemeToggle />
              </DropdownMenuItem>
              <DropdownMenuItem className="p-1 z-50">
                <form
                  className="w-full"
                  action={async () => {
                    "use server";

                    await signOut({
                      redirectTo: "/",
                    });
                  }}
                >
                  <button
                    type="submit"
                    className="w-full text-left px-1 py-0.5 text-red-500"
                  >
                    Sign out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button className="py-2 px-3 sm:px-4 h-fit font-normal text-white text-xs sm:text-sm rounded-lg" asChild>
            <Link href="/login">
              <span className="hidden sm:inline">Be the change + login</span>
              <span className="sm:hidden">Login</span>
            </Link>
          </Button>
        )}
      </div>
    </>
  );
};
