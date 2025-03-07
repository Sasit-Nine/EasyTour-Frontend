import React, { useEffect, useState } from "react"
import { ArrowUpIcon } from '@heroicons/react/20/solid'
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
    notifyOnNetworkStatusChange: true,
  });

  const [processedBookings, setProcessedBookings] = useState([]);
  const [stats, setStats] = useState([
    { name: 'Total Bookings', stat: '0', icon: ArrowUpIcon, iconColor: 'text-green-500' },
    { name: 'Total Revenue', stat: '฿0', icon: ArrowUpIcon, iconColor: 'text-green-500' },
    { name: 'Pending Bookings', stat: '0', icon: ArrowUpIcon, iconColor: 'text-green-500' }
  ]);

  useEffect(() => {
    if (data?.bookings && data.bookings.length > 0) {
      const transformedBookings = data.bookings.map((booking) => ({
        ...booking,
        date: dayjs(booking.createdAt).format("DD/MM/YYYY"),
        total_price: booking.total_price ?? 0,
        booking_status: booking.booking_status?.status ?? "unknown",
      }));

      // ปรับปรุงการรวบรวมข้อมูล โดยใช้ Map เพื่อจัดการข้อมูลที่ซ้ำกัน
      const bookingsByDate = new Map();

      transformedBookings.forEach((booking) => {
        // ถ้ายังไม่มีข้อมูลวันนั้น ให้สร้างข้อมูลใหม่
        if (!bookingsByDate.has(booking.date)) {
          bookingsByDate.set(booking.date, {
            date: booking.date,
            count: 0,
            revenue: 0,
            pendingCount: 0
          });
        }

        // ดึงข้อมูลปัจจุบันของวันนั้น
        const dateData = bookingsByDate.get(booking.date);

        // เพิ่มข้อมูล
        dateData.count += 1;
        dateData.revenue += booking.total_price || 0;
        
        if (booking.booking_status === 'pending') {
          dateData.pendingCount += 1;
        }
      });

      // แปลง Map เป็น Array และเรียงลำดับ
      const sortedBookings = Array.from(bookingsByDate.values())
        .sort((a, b) => dayjs(a.date, 'DD/MM/YYYY').diff(dayjs(b.date, 'DD/MM/YYYY')))
        .filter(booking => booking.count > 0);

      // อัพเดตสถานะ
      setProcessedBookings(sortedBookings);

      // คำนวณสถิติเช่นเดิม
      const totalBookings = sortedBookings.reduce((sum, booking) => sum + booking.count, 0);
      const totalRevenue = sortedBookings.reduce((sum, booking) => sum + booking.revenue, 0);
      const totalPending = data.bookings.filter(booking => booking.booking_status === 'pending').length;

      setStats([
        {
          name: 'รายการจองของเดือนนี้',
          stat: totalBookings.toLocaleString(),
          icon: ArrowUpIcon,
          iconColor: 'text-green-500'
        },
        {
          name: 'รายได้ทั้งหมด',
          stat: `฿${totalRevenue.toLocaleString()}`,
          icon: ArrowUpIcon,
          iconColor: 'text-green-500'
        },
        {
          name: 'รอการอนุมัติ',
          stat: totalPending.toLocaleString(),
          icon: ArrowUpIcon,
          iconColor: 'text-green-500'
        }
      ]);
    }
  }, [data]);

  const currentMonth = dayjs().format('MM/YYYY');
  const lastMonth = dayjs().subtract(1, 'month').format('MM/YYYY');

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
        text: 'จำนวนการจอง',
      },
    },
  };

  const bookingChartSeries = [
    {
      name: "รายการจองเดือนนี้",
      data: processedBookings.map(booking => booking.count)
    },
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
        text: 'รายได้    ฿',
      },
    },
  };

  const revenueChartSeries = [
    {
      name: "รายรับเดือนนี้",
      data: processedBookings.map(booking => booking.revenue),
    }
  ];

  // Loading state
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" role="status"></div>
    </div>
  );
  
  // Error state
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{error.message}</span>
    </div>
  );

  // No data state
  if (!data?.bookings || data.bookings.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl">No bookings found</p>
      </div>
    );
  }

  return (  
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="container mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">ภาพรวมทั้งหมด</h3>

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
            <h4 className="text-xl font-semibold text-gray-800 mb-4">รายการจองเดือนนี้</h4>
            <ReactApexChart
              options={bookingChartOptions}  
              series={bookingChartSeries}
              type="bar"
              height={350}
            />
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">รายได้เดือนนี้</h4>
            <ReactApexChart
              options={revenueChartOptions}  
              series={revenueChartSeries}
              type="bar"
              height={350}
            />
          </div>
        </div>

        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">รายการจองล่าสุด</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {['รายชื่อลูกค้า', 'แพ็กเกจ', 'วันที่จอง', 'สถานะ', 'ราคารวม'].map((header) => (
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