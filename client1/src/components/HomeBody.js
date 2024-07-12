import React from 'react';
import partnerAppImage from '../images/contact1.png';
import webDashboardImage from '../images/contact5.webp';
import apiIntegrationImage from '../images/contact6.webp'; 

const HomeBody = () => {
  const features = [

  ];

  return (
    <>
      {/* <Navbar /> */}
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="flex flex-col items-center justify-center">
         
        </div>
        <div className="max-w-5xl mx-auto space-y-20">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`flex flex-col md:flex-row ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''} items-center`}
            >
              <div className="w-full md:w-1/2 h-64 md:h-80 relative">
                <img
                  className="w-full h-full object-cover rounded-lg shadow-md"
                  src={feature.image}
                  alt={feature.alt}
                />
              </div>
              <div className="mt-4 md:mt-0 md:w-1/2 md:px-6">
                <h2 className="text-xl font-bold mb-2">{feature.title}</h2>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default HomeBody;
