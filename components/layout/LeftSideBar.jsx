'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Menu from './Menu';
import { Logout } from '@mui/icons-material';
import { dark } from "@clerk/themes";
import Loader from "@components/Loader";
import PushPinIcon from '@mui/icons-material/PushPin';
import jwt from "jsonwebtoken";

function LeftSideBar() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({});
    const [user, setUser] = useState(null);  // Set initial value to null

    const getUser = async () => {
        try {
            const response = await fetch(`/api/user/${user.id}`);
            const data = await response.json();
            setUserData(data);
            setLoading(false);
            setIsLoaded(true);
            console.log(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !user) {
            const decodedUser = jwt.decode(token);
            setUser(decodedUser);
            console.log(decodedUser);
        }
    }, []); // Only run on the first render

    useEffect(() => {
        if (user) {
            getUser();
        }
    }, [user]); // Runs when 'user' is updated

    if (loading || !isLoaded) {
        return <Loader />;
    }

    return (
        <div className="h-screen bg-gray-00 left-0 top-0 sticky overflow-auto px-10 py-6 flex flex-col gap-6 max-md:hidden 2xl:w-[350px] pr-20 custom-scrollbar">
            <Link href="/">
                <Image src="/assets/logovani.png" alt="logo" width={200} height={200} className="ml-4 -mb-4" />
            </Link>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 items-center text-black">
                    <Link href={`/profile/${userData.id}/posts`}>
                        <img
                            src={userData?.profilePhoto}
                            alt="profile photo"
                            width={50}
                            height={50}
                            className="rounded-full"
                        />
                    </Link>
                    <p className="text-small-bold">
                        {userData?.firstName} {userData?.lastName}
                    </p>
                </div>
                <div className="flex text-black justify-between">
                    <div className="flex flex-col items-center">
                        <p className="text-base-bold">{userData?.posts?.length}</p>
                        <p className="text-tiny-medium">Posts</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-base-bold">{userData?.followers?.length}</p>
                        <p className="text-tiny-medium">Followers</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-base-bold">{userData?.following?.length}</p>
                        <p className="text-tiny-medium">Following</p>
                    </div>
                </div>
            </div>
            <hr />
            <Menu />
            <p className="text-black mx-3 text-body-bold">
                <span>
                    <PushPinIcon sx={{ color: "#7857FF", cursor: "pointer" }} />
                </span>
                {userData?.pinsCount} left
            </p>
            <hr />
            <div className="flex gap-4 items-center">
                {/* Uncomment the UserButton when you're ready to use it */}
                {/* <UserButton appearance={{ baseTheme: dark }} afterSignOutUrl="/sign-in" /> */}
                <p className="text-black text-body-bold">Manage Account</p>
            </div>
            {/* Uncomment the SignedIn block when you're ready to use it */}
            {/* <SignedIn>
                <SignOutButton afterSignOutUrl="/sign-in">
                    <div className="flex cursor-pointer gap-4 items-center">
                        <Logout sx={{ color: "white", fontSize: "32px" }} />
                        <p className="text-body-bold text-black">Log out</p>
                    </div>
                </SignOutButton>
            </SignedIn> */}
        </div>
    );
}

export default LeftSideBar;
