import React from "react";
import { HiLocationMarker } from "react-icons/hi"; // Import location marker icon from react-icons
import Navbar from "./Navbar";
import Footer from "../Footer";
import aboutImage from "../images/about2.jpg"; // Replace with your image path
import outlet1Image from "../images/outlet1.jfif"; // Replace with your image paths
import outlet2Image from "../images/outlet2.jfif";
import outlet3Image from "../images/outlet3.jfif";
import outlet4Image from "../images/outlet4.jfif";

const About = () => {
  const outlets = [
    {
      name: "Outlet 1",
      address: "Sector4 GaurCity Main Street, Cityville Near Gaurcity Mall",
      image: outlet1Image,
    }, 
    {
      name: "Outlet 2",
      address: "456 Elm Street, TownsvilleNear the crossing republick food plaza",
      image: outlet2Image,
    },
    {
      name: "Outlet 3",
      address: "789 Oak Street, Villagetown Near the Pari chowk Navada street food center",
      image: outlet3Image,
    },
    {
      name: "Outlet 4",
      address: "101 Pine Street, Hamletville Near the Pari chowk Navada street food center",
      image: outlet4Image,
    },
    // Add more outlets as needed
  ];

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-100 to-blue-100">
        <div className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-8">About Our Website</h1>
            <p className="text-gray-700 text-base mb-8">
              Welcome to our website! We are dedicated to providing the best
              services and products to our customers. Our team works tirelessly
              to ensure customer satisfaction and deliver quality experiences.
              We believe in the value of customer feedback and continuously
              strive to improve our offerings based on your suggestions. Whether
              you're looking for information, services, or products, we aim to
              be your go-to source. Thank you for choosing us, and we look
              forward to serving you. Join our community and stay updated with
              the latest news and special offers by subscribing to our
              newsletter. Together, we can achieve great things and make a
              difference.
            </p>
            <hr className="my-4 border-t-2 border-blue-800" />
          </div>
        </div>

        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-10 sm:px-6 lg:px-15 py-1">
            <h1 className="text-4xl font-bold mb-8 text-center">Hey You Can Visit My Diffrent Outlets</h1>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-1 justify-center">
              {outlets.map((outlet, index) => (
                <div
                  key={index}
                  className="max-w-md rounded-lg overflow-hidden shadow-lg bg-white m-4 border border-gray-300 hover:shadow-xl transform hover:scale-105 transition duration-300"
                >
                  <img
                    className="w-full h-64 object-cover rounded-t-lg"
                    src={outlet.image}
                    alt={outlet.name}
                  />
                  <div className="px-6 py-4">
                    <div className="flex items-center mb-2">
                      <HiLocationMarker className="h-5 w-5 mr-2 text-gray-600" /> {/* Location marker icon */}
                      <div className="font-bold text-xl">{outlet.name}</div>
                    </div>
                    <p className="text-gray-700 text-base">{outlet.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <img
              className="w-full h-96 object-cover rounded-lg shadow-lg mb-8"
              src={aboutImage}
              alt="About Us"
            />
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default About;


