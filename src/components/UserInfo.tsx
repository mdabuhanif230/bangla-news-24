"use client";

import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

const UserInfo = () => {
  const { data: session, refetch } = authClient.useSession();
  const user = session?.user;
  const refreshedForUser = useRef<string | null>(null);
  const [avatarLoadedFor, setAvatarLoadedFor] = useState<string | null>(null);
  const avatarLoaded = !!user && avatarLoadedFor === user.id;
  const initial =
    user?.email?.trim().charAt(0).toUpperCase() ||
    user?.name?.trim().charAt(0).toUpperCase() ||
    "?";

  useEffect(() => {
    const userId = user?.id;

    if (!userId) {
      refreshedForUser.current = null;
      return;
    }

    if (refreshedForUser.current === userId) return;
    refreshedForUser.current = userId;
    void refetch({ query: { disableCookieCache: true } });
  }, [user?.id, refetch]);

  const handleSignout = async () => {
    await authClient.signOut();
  };

  return (
    <div className="absolute right-4 top-4 flex items-center gap-3 text-sm">
      {user ? (
        <div className="flex flex-col items-center gap-2">
          <Link href={"/profile"}>
            <div className="avatar">
              <div className="ring-primary ring-offset-base-100 relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-offset-2">
                {!avatarLoaded && (
                  <span
                    aria-label={`${user.email || user.name}'s avatar`}
                    className="flex h-full w-full items-center justify-center bg-red-700 text-lg font-semibold uppercase text-white"
                  >
                    {initial}
                  </span>
                )}
                <img
                  key={user.id}
                  src="/api/profile/avatar"
                  alt=""
                  aria-hidden="true"
                  className={`absolute inset-0 h-full w-full object-cover ${
                    avatarLoaded ? "visible" : "invisible"
                  }`}
                  onLoad={() => setAvatarLoadedFor(user.id)}
                  onError={() => setAvatarLoadedFor(null)}
                />
              </div>
            </div>
          </Link>

          <h2>{user?.name}</h2>

          <button onClick={handleSignout} className="btn btn-error btn-xs">
            Signout
          </button>
        </div>
      ) : (
        <div>
          <Link href={"/signin"}>
            <button className="btn btn-ghost text-neutral-700 transition-colors hover:text-red-700">
              সাইন ইন
            </button>
          </Link>
          <Link href={"/signup"}>
            {" "}
            <button className="btn  bg-red-700 px-3 py-1.5 font-semibold text-white transition-colors hover:bg-red-800">
              সাইন আপ
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
