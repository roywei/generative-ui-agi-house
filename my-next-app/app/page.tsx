// page.tsx
"use client"

import React, { useState, useEffect, useRef } from 'react';

import Image from 'next/image';

export default function Home() {
  const [backgroundImage, setBackgroundImage] = useState('/background1.jpg');
  const [city, setCity] = useState('New York'); // default value or the first option from dropdown
  const [musicFile, setMusicFile] = useState('/new-york.mp3');
  const [ageGroup, setAgeGroup] = useState('Gen Z'); // default value or the first option from dropdown
  const [profession, setProfession] = useState(''); // You haven't used profession in your form
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const cityMusicMap = {
    'New York': '/new_york.mp3',
    'Tokyo': '/audio/tokyo.mp3',
    'London': '/audio/london.mp3',
    'San Francisco': '/hotel_california.mp3',
    // Add more city-music mappings as needed
  };

  useEffect(() => {
    // Update the music file when the city changes
    setMusicFile(cityMusicMap[city]);
  }, [city]); // Re-run the effect when the city changes

  useEffect(() => {
    // Whenever the music file changes, play the new file
    if (musicFile) {
      audioRef.current.pause();
      audioRef.current.load(); // Required to change the source and play the new file
      audioRef.current.play();
    }
  }, [musicFile]);



  // Function to handle background change from dropdown
  const handleBackgroundChange = (e) => {
    setBackgroundImage(e.target.value);
  };
  
  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Construct the data object based on the selections
    const data = {
      city,
      ageGroup
    };
  
    // Make a POST request to your API route
    const response = await fetch('/api/generate-background', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const { imageUrl } = await response.json();
      setBackgroundImage(imageUrl); // Update the background with the new image URL
    } else {
      console.error('Failed to generate image');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative">
      {/* Background Image with Opacity */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        opacity: 0.4, // Set the opacity to 40%
      }}></div>
      {/* Forefront Image */}
      <div className="z-10">
        <Image
          src="/bag.jpg"
          alt="Forefront Image"
          width={1000}
          height={600}
          priority
        />
      </div>

      {/* Configurable options for DALL-E generation */}
      <form onSubmit={handleSubmit} className="absolute bottom-0 flex w-full items-center justify-center p-4 bg-white">
        {/* Background Dropdown */}
        <div className="mx-2">
          <label htmlFor="backgroundSelect">Default Background:</label>
          <select id="backgroundSelect" defaultValue="/background1.jpg" onChange={handleBackgroundChange} className="p-2 mx-2">
            <option value="/background1.jpg">Background 1</option>
            <option value="/background2.jpg">Background 2</option>
          </select>
        </div>

        {/* City Dropdown */}
        <div className="mx-2">
          <label htmlFor="citySelect">City:</label>
          <select id="citySelect" value={city} onChange={(e) => setCity(e.target.value)} className="p-2 mx-2">
            <option value="New York">New York</option>
            <option value="Tokyo">Tokyo</option>
            <option value="London">London</option>
            <option value="San Francisco">San Francisco</option>
          </select>
        </div>

        {/* Age Group Dropdown */}
        <div className="mx-2">
          <label htmlFor="ageGroupSelect">Age Group:</label>
          <select id="ageGroupSelect" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className="p-2 mx-2">
            <option value="Gen Z">Gen Z</option>
            <option value="Millennials">Millennials</option>
            <option value="Gen X">Seniors</option>
          </select>
        </div>

        {/* Generate Background Button */}
        <div className="mx-2">
          <button type="submit" className="p-2 mx-2">Generate Background</button>
        </div>
        {/* Audio Player */}
      <audio ref={audioRef} loop controls>
        <source src={musicFile} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      </form>
      
    </main>
  );
}
