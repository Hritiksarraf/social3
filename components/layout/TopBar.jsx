"use client";

import { useEffect, useState } from "react";
import { Add, Logout, Person, Search } from "@mui/icons-material";
import { useRouter } from "next/navigation";
// import { SignOutButton, SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { dark } from "@clerk/themes";


const TopBar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  return  (
    <div className="flex justify-between items-center mt-6">
      <div className="relative">
        <input
          type="text"
          className="search-bar"
          placeholder="Search posts, people, ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search
          className="search-icon"
          onClick={() => router.push(`/search/posts/${search}`)}
        />
      </div>

      <button
        className="create-post-btn"
        onClick={() => router.push("/create-post")}
      >
        <Add /> <p>Create A Post</p>
      </button>
        <div className="flex gap-3">
        {/* <SignedIn>
            <SignOutButton>
                <div className='flex cursor-pointer gap-4 items-center  md:hidden'>
                    <Logout sx={{color:"white" , fontSize:"32px"}}/>
                    <p className='text-body-bold text-light-1'></p>
                </div>
            </SignOutButton>
        </SignedIn> */}
        <Link href='/'>
         <div className="rounded-full md:hidden">
         {/* <UserButton  appearance={{baseTheme: dark}}  afterSignOutUrl="/sign-in" /> */}
         </div>
        
            
        </Link>
        </div>
      
    </div>
  );
};

export default TopBar;
