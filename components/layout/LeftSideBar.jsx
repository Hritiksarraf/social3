'use client'
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Menu from './Menu';
import Loader from "@components/Loader";
import Avatar from "@components/ui/Avatar";
import { PlusIcon } from "@components/icons";
import { CLUBS, CLUB_KEYS } from "@components/ui/ClubBadge";
import { useCurrentUser } from '@lib/hooks/useCurrentUser';
import { useSupabase } from '@lib/supabase/SupabaseProvider';

function LeftSideBar() {
    const router = useRouter();
    const { supabase } = useSupabase();
    const { authLoading, currentUser, currentUserLoading } = useCurrentUser();

    if (authLoading || currentUserLoading || !currentUser) {
        return <Loader />;
    }

    const handleLogOut = async () => {
        await supabase.auth.signOut();
        router.push('/sign-in');
    };

    return (
        <div className="h-screen left-0 top-0 sticky overflow-auto px-5 py-6 flex flex-col max-md:hidden 2xl:w-[300px] w-[260px] custom-scrollbar">
            <Link href="/" className="flex items-center gap-2.5 px-2 mb-6">
                <div
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center -rotate-3"
                    style={{ background: "linear-gradient(135deg, #7857FF, #FF0073)" }}
                >
                    <div className="flex gap-[2px] items-end h-4">
                        <span className="w-[3px] bg-white rounded-sm" style={{ height: 6 }} />
                        <span className="w-[3px] bg-white rounded-sm" style={{ height: 15 }} />
                        <span className="w-[3px] bg-white rounded-sm" style={{ height: 10 }} />
                    </div>
                </div>
                <span className="font-display font-extrabold text-xl tracking-tight">Yuva Vaani</span>
            </Link>

            <Menu currentUser={currentUser} />

            <button
                onClick={() => router.push("/create-post")}
                className="mt-2 py-3.5 rounded-full font-extrabold text-[15px] flex items-center justify-center gap-2 text-white"
                style={{
                    background: "linear-gradient(135deg, #7857FF, #FF0073)",
                    boxShadow: "0 14px 28px -10px rgba(120,87,255,0.9)",
                }}
            >
                <PlusIcon size={18} strokeWidth={2.6} color="#fff" />
                New post
            </button>

            <p className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-ink-4 mt-6 mb-3 px-2">
                Clubs
            </p>
            <div className="flex flex-col gap-1 px-1">
                {CLUB_KEYS.map((key) => {
                    const c = CLUBS[key];
                    return (
                        <Link
                            key={key}
                            href={`/?club=${key}`}
                            className="flex items-center gap-2.5 text-sm font-bold text-ink-2 hover:text-white py-1"
                        >
                            <span
                                className="w-[22px] h-[22px] rounded-[7px]"
                                style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
                            />
                            {c.label}
                        </Link>
                    );
                })}
            </div>

            <p className="text-light-1 mx-2 mt-6 text-sm font-bold flex items-center gap-2">
                📌 {currentUser?.pinsCount} pins left
            </p>

            <div className="mt-auto flex items-center gap-2.5 bg-surface-1 rounded-2xl px-2.5 py-2 pt-4">
                <Link href={`/profile/${currentUser._id}/posts`}>
                    <Avatar src={currentUser.profilePhoto} name={currentUser.firstName} size="sm" />
                </Link>
                <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-[13px] truncate">{currentUser?.firstName} {currentUser?.lastName}</p>
                    <p className="text-[11px] text-ink-3 truncate">@{currentUser?.userName}</p>
                </div>
                <button
                    onClick={handleLogOut}
                    aria-label="Log out"
                    className="text-ink-3 hover:text-danger text-xs font-extrabold px-2"
                >
                    Log out
                </button>
            </div>
        </div>
    );
}

export default LeftSideBar;
