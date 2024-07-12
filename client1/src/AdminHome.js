

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import NavbarAdmin from './components/NavbarAdmin';

const AdminHome = () => {
  const [orderData, setOrderData] = useState([]);

  const chartContainer = useRef(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/order-history');
        setOrderData(response.data);
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    };

    fetchOrderData();
  }, []);

        

  return (
    <>
      <NavbarAdmin />
    </>
  );
};

export default AdminHome;
