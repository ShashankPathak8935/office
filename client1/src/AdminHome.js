// Updated AdminHome.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import NavbarAdmin from './components/NavbarAdmin';

const AdminHome = () => {
  const [orderData, setOrderData] = useState([]);
  const [todayOrders, setTodayOrders] = useState(0);
  const [weeklyOrders, setWeeklyOrders] = useState(0);
  const [monthOrders, setMonthOrders] = useState(0);
  const [chartInstance, setChartInstance] = useState(null);
  const chartContainer = useRef(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/order-history'); // Replace with your backend endpoint
        setOrderData(response.data.monthlyOrders);
        setTodayOrders(response.data.todayOrders);
        setWeeklyOrders(response.data.weeklyOrders);
        setMonthOrders(response.data.monthOrders);
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    };

    fetchOrderData();
  }, []);

  useEffect(() => {
    const chartOrders = (data) => {
      if (chartContainer.current && data.length > 0) {
        if (chartInstance) {
          chartInstance.destroy();
        }

        const months = data.map(entry => entry.month);
        const orders = data.map(entry => entry.total_orders);

        const ctx = chartContainer.current.getContext('2d');
        const newChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: months,
            datasets: [
              {
                label: 'Orders per Month',
                data: orders,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              },
              {
                label: 'Today\'s Orders',
                data: Array(months.length).fill(0).map((_, index) => index === months.length - 1 ? todayOrders : 0),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              },
              {
                label: 'Weekly Orders',
                data: Array(months.length).fill(0).map((_, index) => index === months.length - 1 ? weeklyOrders : 0),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
              },
              {
                label: 'Monthly Orders',
                data: Array(months.length).fill(0).map((_, index) => index === months.length - 1 ? monthOrders : 0),
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                }
              },
              y: {
                beginAtZero: true,
                grid: {
                  display: true
                }
              }
            }
          }
        });

        setChartInstance(newChartInstance);
      }
    };

    chartOrders(orderData);

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [orderData, todayOrders, weeklyOrders, monthOrders]);

  return (
    <>
      <NavbarAdmin />
      <div className="container mx-auto px-4 mt-8">
        <h4 className="text-3xl font-bold mb-4">Orders Overview</h4>
        <div className="bg-white rounded-lg shadow-md p-6">
          <canvas ref={chartContainer} id="orderChart" width="400" height="170"></canvas>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
