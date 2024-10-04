"use client"
import { useEffect, useState } from 'react';
export default function ComingSoon() {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');

    useEffect(() => {
        const fetchCountries = async () => {
            try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            const data = await response.json();
            const sortedCountries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
            setCountries(sortedCountries);
            } catch (error) {
            console.error('Error fetching country data:', error);
            }
        };

        fetchCountries();
    }, []);
    return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center relative px-4">
        <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-30"
        style={{
            backgroundImage: `url('/assets/bg.webp')`,
        }}
        />
        
        <div className="z-50 h-screen w-full flex flex-col">
            <div className=" top-0 w-full  flex items-center justify-center ">
                <img src={"/assets/background.png"} className="md:w-80  w-28 " />
            </div>
        <div className="w-full flex items-center justify-center md:h-[20%] md:text-[40px] h-[10%] text-[20px]">

        <h1 className="text-[20px] md:text-[60px] text-white font-bold mt-10 mb-10 ">Stay <span className="text-blue-400">Tuned </span></h1>
        </div>
        <div className="w-full flex items-center justify-center mt-5 mb-1">
            <p className="text-white md:text-[30px] text-[15px]">
            We are building the world's largest Campus Radio Network from India
            </p>
        </div>
        <div className="w-full flex items-center justify-center flex-col md:flex-row pt-52 md:pt-0  md:mt-5">
            <p className="text-white text-[15px] md:text-[20px]">
            Tune in on our launch :  
            </p>
            <input className=" w-72 rounded-sm text-black placeholder:text-center p-1" placeholder="Register Your Email"/>
        </div>
        <div className="country-dropdown md:flex items-center justify-center mt-4  md:flex-row flex-col" >
            <div className='flex items-center justify-center w-full md:w-96'>
            <label htmlFor="country" className='text-white text-[15px] md:text-[20px]'>Select your country :  </label>
            <select
                id="country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-60"
            >
                <option value="" disabled className='text-[15px] md:text-[20px]'>Select your country</option>
                {countries.map((country) => (
                <option key={country.cca2} value={country.name.common}>
                    {country.name.common}
                </option>
                ))}
            </select>
            </div>

            {/* Display selected country flag */}
            {selectedCountry && (
                <div className="selected-country-info  ml-4 text-white flex items-center justify-center mt-4 md:mt-0">
                {countries
                    .filter((country) => country.name.common === selectedCountry)
                    .map((filteredCountry) => (
                    <div key={filteredCountry.cca2} className="flex items-center">
                        <img
                        src={filteredCountry.flags.svg}
                        alt={`${filteredCountry.name.common} flag`}
                        className="w-8 h-6 mr-2"
                        />
                        <p>{filteredCountry.name.common}</p>
                    </div>
                    ))}
                </div>
            )}
            </div>
        </div>
        

    </div>
    );
}
