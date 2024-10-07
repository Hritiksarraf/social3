'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Updated import
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

export default function Page() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [collage, setCollage] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(true);
  const [colleges, setColleges] = useState([]);

  const router = useRouter(); // Using next/navigation's useRouter

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/');
    }
  }, [router]);
  useEffect(() => {

    fetch('http://universities.hipolabs.com/search')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setColleges(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching colleges:', error);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => { // Fixed typo from 'handelChange' to 'handleChange'
    const { name, value } = e.target;
    if (name === 'firstname') setFirstName(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'lastname') setLastName(value);
    else if (name === 'username') setUsername(value);
    else if (name === 'collage') setCollage(value);
    else if (name === 'addresh') setAddress(value);
    else if (name === 'pincode') setPincode(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { firstname,lastname,collage,pincode,address,username, email, password, };

    try {
      let collegeRes= await fetch("/api/maps/college",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name:collage})
      })
      console.log("clg",collegeRes)
      if (!collegeRes.ok) {
        throw new Error('Failed to add college');
    }

      
      const locationresponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(collage)}&format=json`);
      const locationdata = await locationresponse.json();
      console.log("res",locationdata)
      if(locationdata.length>0){
        let updateRes = await fetch("/api/maps/college/change",{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name:username,collegeName:collage,lat:locationdata[0].lat,lng:locationdata[0].lon})
        })
        console.log("abc",updateRes)
        if (!updateRes.ok) {
          throw new Error('Failed to update college location');
        }
      }
      let res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      let response = await res.json();
      console.log(response);

      
      setEmail('');
      setPassword('');
      
      toast.success('Signup Successful', {
        position: 'top-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });

      


      // Redirect to another page if needed
      router.push('/sign-in');
      
    } catch (error) {
      toast.error('Signup Failed', {
        position: 'top-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };
  const handleChanges = (event) => {
    setCollage(event.target.value);
  };

  return (
    <>
    <form className=''>
      <div className="lg:w-2/6 md:w-2/3 bg-gray-100 rounded-lg p-8 flex mx-auto my-20 flex-col  w-full">
      <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Sign Up</h2>
      <div className="relative mb-4">
        <label htmlFor="firstname" className="leading-7 text-sm text-gray-600">First Name</label>
        <input value={firstname} onChange={handleChange} type="text" id="firstname" name="firstname" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>
      <div className="relative mb-4">
        <label htmlFor="lastname" className="leading-7 text-sm text-gray-600">Last Name</label>
        <input value={lastname} onChange={handleChange} type="text" id="lastname" name="lastname" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>
      <div className="relative mb-4">
        <label htmlFor="username" className="leading-7 text-sm text-gray-600">Username</label>
        <input value={username} onChange={handleChange} type="text" id="username" name="username" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>
      <div className="relative mb-4">
        <label htmlFor="collage" className="leading-7 text-sm text-gray-600">Collage</label>
        <div>
      {loading ? (
        <p>Loading colleges...</p>
      ) : (
        <select value={collage} onChange={handleChanges}>
          <option value="">Select a college</option>
          {colleges.map((college, index) => (
            <option key={index} value={college.name}>
              {college.name} - {college.country}
            </option>
          ))}
        </select>
      )}
    </div>
      </div>
      <div className="relative mb-4">
        <label htmlFor="addresh" className="leading-7 text-sm text-gray-600">Addresh</label>
        <input value={address} onChange={handleChange} type="text" id="addresh" name="addresh" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>
      <div className="relative mb-4">
        <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
        <input value={pincode} onChange={handleChange} type="text" id="pincode" name="pincode" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>
      <div className="relative mb-4">
        <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
        <input value={email} onChange={handleChange} type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>
      <div className="relative mb-4">
        <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>
        <input value={password} onChange={handleChange} type="password" id="password" name="password" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>
      <div className='flex justify-center gap-10'>
      <button onClick={handleSubmit} className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Sign-up</button>
      <Link href={"/sign-in"}>
            <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
              Sign-in
            </button>
        </Link>
      
     
      </div>
  
      <p className="text-xs text-gray-500 mt-3">Literally you probably haven't heard of them jean shorts.</p>
    </div>
    
    </form>
    <ToastContainer/>
    </>
  );
}
