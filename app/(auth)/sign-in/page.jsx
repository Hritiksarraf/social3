'use client'
import React from "react";
import Link from "next/link";
import { useState,useEffect} from "react";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router=useRouter()

  useEffect(() => {
    if(localStorage.getItem('token')){
      router.push('/')
    }
  }, [])
  

  const handelChange = (e) => {
    if (e.target.name == "email") {
      setEmail(e.target.value);
    } else if (e.target.name == "password") {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, password };
    let res = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let responce = await res.json();
    console.log(responce);
    setEmail("");
    setPassword("");
    if(responce.success){
      localStorage.setItem('token',responce.token)
      toast.success("Successfully logedin", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        router.push('/')
      }, 1000);
    }
    else{
      toast.error(responce.error, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    })
    
  };
}

  return (
    <div className="">
      <form className="lg:w-2/6 md:w-2/3 bg-gray-100 rounded-lg p-8 flex mx-auto my-20 flex-col  w-full  ">
        <h2 className="text-gray-900 text-lg font-medium title-font mb-5">login</h2>

        <div className="relative mb-4">
          <label htmlFor="email" className="leading-7 text-sm text-gray-600">
            Email
          </label>
          <input
          onChange={handelChange}
            value={email}
            type="email"
            id="email"
            name="email"
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="relative mb-4">
          <label htmlFor="password" className="leading-7 text-sm text-gray-600">
            Passward
          </label>
          <input
          onChange={handelChange}
          value={password}
            type="password"
            id="password"
            name="password"
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="flex justify-center gap-10">
          <Link href={"/sign-up"}>
            <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
              Sign-up
            </button>
          </Link>
          <button onClick={handleSubmit} className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
            Sign-in
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Literally you probably haven't heard of them jean shorts.
        </p>
      </form>
      <ToastContainer/>
    </div>
  );
}

export default Login;
