// page.tsx
"use client"

import React, { useState, useEffect, useRef } from 'react';

import Image from 'next/image';

export default function Home() {
  const [backgroundImage, setBackgroundImage] = useState('/new_york.jpg');
  const [city, setCity] = useState('New York'); // default value or the first option from dropdown
  const [musicFile, setMusicFile] = useState('/new-york.mp3');
  const [ageGroup, setAgeGroup] = useState('Gen Z'); // default value or the first option from dropdown
  const audioRef = useRef(null);
  const [forefrontImage, setForefrontImage] = useState('/bag.jpg'); // Default forefront image


  // Initialize local storage with default values if it's empty
  useEffect(() => {
    const defaultImages = {
      'San Francisco-Millennials': ['/san_francisco.jpg.jpg'],
      'New York-Millennials': ['/new_york.jpg'],
      'Paris-Millennials': ['/paris.jpg'],
      // Add more default paths for each city-age group combination
    };

    Object.entries(defaultImages).forEach(([key, value]) => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });
  }, []);

  const cityMusicMap = {
    'New York': '/new_york.mp3',
    'Tokyo': '/tokyo.mp3',
    'London': '/london.mp3',
    'San Francisco': '/hotel_california.mp3',
    'Paris': '/paris.mp3'
    // Add more city-music mappings as needed
  };

  const cities = ['New York', 'Tokyo', 'London', 'San Francisco', 'Paris']; // Add all available options
  const ageGroups = ['Gen Z', 'Millennials', 'Seniors']; // Add all available options

  // Function to set random city and age group
  const setRandomCombination = () => {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomAgeGroup = ageGroups[Math.floor(Math.random() * ageGroups.length)];
    setCity(randomCity);
    setAgeGroup(randomAgeGroup);
  };

  const getRandomImagePath = (city, ageGroup) => {
    const storageKey = `${city}-${ageGroup}`;
    const images = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      return images[randomIndex];
    }
    return null; // Or return a default image path
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

  useEffect(() => {
    if (ageGroup === 'Seniors') {
      setForefrontImage('/senior_front.jpg');
    } else {
      setForefrontImage('/bag.jpg'); // Reset to default when age group is not 'Seniors'
    }
  }, [ageGroup]);

  // Function to handle background change from dropdown
  const handleBackgroundChange = (e) => {
    setBackgroundImage(e.target.value);
  };

  const generateStorageKey = (city, ageGroup) => `image-${city}-${ageGroup}`;


  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Construct the data object based on the selections
    const data = {
      city,
      ageGroup
    };

    const storageKey = generateStorageKey(city, ageGroup);
    let images;
    try {
      const storedData = localStorage.getItem(storageKey);
      images = storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error('Failed to parse local storage item:', error);
      images = []; // Default to an empty array if parsing fails
    }


    if (images.length > 0) {
      // If images are available, pick a random one and set it
      const randomIndex = Math.floor(Math.random() * images.length);
      setBackgroundImage(images[randomIndex]);
    } else {

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
        images.push(imageUrl);
        localStorage.setItem(storageKey, JSON.stringify(images));

      } else {
        console.error('Failed to generate image');
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative">
      {/* Background Image with Opacity */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        opacity: 0.3, // Set the opacity to 40%
      }}></div>
      {/* Forefront Image */}
      <div className="z-10">
        <Image
          src={forefrontImage} // Use the state for the image source
          alt="Forefront Image"
          width={1000}
          height={600}
          priority
        />
      </div>

      {/* Configurable options for DALL-E generation */}
      <form onSubmit={handleSubmit} className="absolute bottom-0 flex w-full items-center justify-center p-4 bg-white">
        {/* Randomize Button */}
        <button onClick={setRandomCombination} className="absolute bottom-10 left-10 p-2">
          Random Profile
        </button>


        {/* City Dropdown */}
        <div className="mx-2">
          <label htmlFor="citySelect">City:</label>
          <select id="citySelect" value={city} onChange={(e) => setCity(e.target.value)} className="p-2 mx-2">
            <option value="New York">New York</option>
            <option value="Tokyo">Tokyo</option>
            <option value="London">London</option>
            <option value="San Francisco">San Francisco</option>
            <option value="San Francisco">Paris</option>
          </select>
        </div>

        {/* Age Group Dropdown */}
        <div className="mx-2">
          <label htmlFor="ageGroupSelect">Age Group:</label>
          <select id="ageGroupSelect" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className="p-2 mx-2">
            <option value="Gen Z">Gen Z</option>
            <option value="Millennials">Millennials</option>
            <option value="Seniors">Seniors</option>
          </select>
        </div>

        {/* Generate Background Button */}
        <div className="mx-2">
          <button type="submit" className="p-2 mx-2">Regenerate</button>
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
