import React, { useEffect, useState } from 'react';




const ImageWithTextOverlay = () => {
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchClick = () => {
    setShowDropdown(true);
  };

  return (
    <div className="relative">
      

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
        <div className="text-white text-center p-4">
         
          <h1 className="text-4xl font-bold mb-2"></h1>
         
          <p className="text-sm"></p>
       
        </div>
      </div>
    </div>
  );
};

export default ImageWithTextOverlay;
