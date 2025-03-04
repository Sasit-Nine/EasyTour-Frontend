import React from "react"
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { QUERY_BOOKING } from "../../services/Graphql"
import { useQuery } from "@apollo/client"
import ReactApexChart from 'react-apexcharts'

const stats = [
  { name: 'Total Subscribers', stat: '71,897', previousStat: '70,946', change: '12%', changeType: 'increase' },
  { name: 'Avg. Open Rate', stat: '58.16%', previousStat: '56.14%', change: '2.02%', changeType: 'increase' },
  { name: 'Avg. Click Rate', stat: '24.57%', previousStat: '28.62%', change: '4.05%', changeType: 'decrease' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
const Dashboard = () => {
  const { data, loading, error, refetch } = useQuery(QUERY_BOOKING, {
    variables: {
      filters: {
        booking_status: {
          eq: "pending"
        }
      },
    },
    context: {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  });
  console.log(data)
  const bookings = data?.bookings || []  // ตรวจสอบว่ามีข้อมูล bookings หรือไม่

  // ตรวจสอบค่าของ bookingChartOptions และ revenueChartOptions
  const bookingChartOptions = {
    chart: {
      type: 'line',
      height: 350,
    },
    xaxis: {
      categories: bookings.map(booking => booking.date),
    },
    yaxis: {
      title: {
        text: 'Number of Bookings',
      },
    },
  };

  const bookingChartSeries = [{
    name: "Bookings",
    data: bookings.map(booking => booking.count),
  }];

  const revenueChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
    },
    xaxis: {
      categories: bookings.map(booking => booking.date),
    },
    yaxis: {
      title: {
        text: 'Revenue',
      },
    },
  };

  const revenueChartSeries = [{
    name: "Revenue",
    data: bookings.map(booking => booking.revenue),
  }];

  // กำหนดค่าเริ่มต้นให้กับ stats หากไม่พบข้อมูล
  const stats = [
    {
      name: 'Total Bookings',
      stat: bookings.length || 'N/A',
      previousStat: '70,946',
      change: '12%',
      changeType: 'increase'
    },
    {
      name: 'Pending Bookings',
      stat: bookings.filter(booking => booking.status === 'pending').length || 'N/A',
      previousStat: '56.14%',
      change: '2.02%',
      changeType: 'increase'
    },
    {
      name: 'Completed Bookings',
      stat: bookings.filter(booking => booking.status === 'completed').length || 'N/A',
      previousStat: '28.62%',
      change: '4.05%',
      changeType: 'decrease'
    },
  ]

  return (  
    <div>
      <h3 className="text-base font-semibold text-gray-900">Last 30 days</h3>

      <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm md:grid-cols-3 md:divide-x md:divide-y-0">
        {stats.map((item) => (
          <div key={item.name} className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-gray-900">{item.name}</dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                {item.stat}
                <span className="ml-2 text-sm font-medium text-gray-500">from {item.previousStat}</span>
              </div>

              <div
                className={classNames(
                  item.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                  'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0',
                )}
              >
                {item.changeType === 'increase' ? (
                  <ArrowUpIcon aria-hidden="true" className="mr-0.5 -ml-1 size-5 shrink-0 self-center text-green-500" />
                ) : (
                  <ArrowDownIcon aria-hidden="true" className="mr-0.5 -ml-1 size-5 shrink-0 self-center text-red-500" />
                )}

                <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                {item.change}
              </div>
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          <h4 className="text-lg font-semibold">Bookings Over Time</h4>
          <ReactApexChart
            options={bookingChartOptions}  
            series={bookingChartSeries}
            type="line"
            height={350}
          />
        </div>

        <div className="col-span-1">
          <h4 className="text-lg font-semibold">Revenue Over Time</h4>
          <ReactApexChart
            options={revenueChartOptions}  
            series={revenueChartSeries}
            type="bar"
            height={350}
          />
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-lg font-semibold">Latest 10 Bookings</h4>
        <table className="min-w-full table-auto mt-4">
          <thead>
            <tr>
            <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Booking Date</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.slice(0, 10).map((booking, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{booking.customerName}</td>
                <td className="px-4 py-2">{booking.date}</td>
                <td className="px-4 py-2">{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard