import React, { useEffect, useState } from "react"
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { QUERY_BOOKING } from "../../services/Graphql"
import { useQuery } from "@apollo/client"
import ReactApexChart from 'react-apexcharts'
import dayjs from 'dayjs'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Dashboard = () => {
  const { data, loading, error, refetch } = useQuery(QUERY_BOOKING, {
    variables: {
      filters: {}, 
    },
    context: {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  });

  const [processedBookings, setProcessedBookings] = useState([]);

  useEffect(() => {
    if (data && data.bookings) {
      const transformedBookings = data.bookings.map((booking) => ({
        ...booking,
        date: dayjs(booking.createdAt).format('DD/MM/YYYY'),
      }));

      const bookingsByDate = transformedBookings.reduce((acc, booking) => {
        const existingDate = acc.find(item => item.date === booking.date);
        if (existingDate) {
          existingDate.count += 1;
          existingDate.revenue += booking.total_price || 0;
        } else {
          acc.push({
            date: booking.date,
            count: 1,
            revenue: booking.total_price || 0
          });
        }
        return acc;
      }, []);

      setProcessedBookings(bookingsByDate.sort((a, b) => 
        dayjs(a.date, 'DD/MM/YYYY').diff(dayjs(b.date, 'DD/MM/YYYY'))
      ));
    }
  }, [data]);

  const totalBookings = processedBookings.reduce((sum, booking) => sum + booking.count, 0);
  const totalRevenue = processedBookings.reduce((sum, booking) => sum + booking.revenue, 0);
  
  const bookingChartOptions = {
    chart: {
      type: 'line',
      height: 350,
    },
    plotOptions: {
      bar: {
        columnWidth: '20%',
        borderRadius: 2,
      },
    },
    xaxis: {
      categories: processedBookings.map(booking => booking.date),
    },
    yaxis: {
      title: {
        text: 'Number of Bookings',
      },
    },
  };

  const bookingChartSeries = [
    {
      name: "รายการจองเดือนที่แล้ว",
      data: processedBookings.map(booking => booking.count),
    },
    {
      name: "รายการจองเดือนนี้",
      data: processedBookings.map(booking => booking.count)
    }
  ];

  const revenueChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        columnWidth: '20%',
        borderRadius: 2,
      },
    },
    xaxis: {
      categories: processedBookings.map(booking => booking.date),
    },
    yaxis: {
      title: {
        text: 'Revenue (THB)',
      },
    },
  };

  const revenueChartSeries = [
    {
      name: "รายรับเดือนที่แล้ว",
      data: processedBookings.map(booking => booking.revenue),
    },
    {
      name: "รายรับเดือนนี้",
      data: processedBookings.map(booking => booking.revenue),
    }
  ];

  const stats = [
    {
      name: 'Total Bookings',
      stat: totalBookings.toLocaleString(),
      icon: ArrowUpIcon,
      iconColor: 'text-green-500'
    },
    {
      name: 'Total Revenue',
      stat: `฿${totalRevenue.toLocaleString()}`,
      icon: ArrowUpIcon,
      iconColor: 'text-green-500'
    },
    {
      name: 'Pending Bookings',
      stat: processedBookings.filter(booking => 
        data.bookings.some(b => 
          dayjs(b.createdAt).format('DD/MM/YYYY') === booking.date && 
          b.booking_status === 'pending'
        )
      ).length.toLocaleString(),
      icon: ArrowUpIcon,
      iconColor: 'text-green-500'
    }
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{error.message}</span>
    </div>
  );

  return (  
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="container mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((item) => (
            <div key={item.name} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <dt className="text-sm font-medium text-gray-500">{item.name}</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{item.stat}</dd>
                </div>
                {item.icon && (
                  <item.icon 
                    className={`h-8 w-8 ${item.iconColor}`} 
                    aria-hidden="true" 
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Bookings per Day</h4>
            <ReactApexChart
              options={bookingChartOptions}  
              series={bookingChartSeries}
              type="bar"
              height={350}
            />
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Revenue per Day</h4>
            <ReactApexChart
              options={revenueChartOptions}  
              series={revenueChartSeries}
              type="bar"
              height={350}
            />
          </div>
        </div>

        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Latest Bookings</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {['Customer Name', 'Package', 'Booking Date', 'Status', 'Total Price'].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.bookings.slice(0, 10).map((booking, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">{`${booking.fname} ${booking.lname}`}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{booking.package?.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{dayjs(booking.createdAt).format('DD/MM/YYYY')}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.booking_status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : booking.booking_status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.booking_status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-green-600 font-semibold">฿{booking.total_price?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard