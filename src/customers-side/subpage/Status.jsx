import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid'
import { QUERY_BOOKING } from '../../services/Graphql'
import { useQuery } from '@apollo/client'
import { useAuth } from '../../context/AuthContext'
import dayjs from 'dayjs'

const statuses = {
    Paid: 'text-green-700 bg-green-50 ring-green-600/20',
    Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
    Overdue: 'text-red-700 bg-red-50 ring-red-600/10',
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Status = () => {
    const strapiBaseURL = import.meta.env.VITE_STRAPI_URL
    const { user } = useAuth();
    console.log(user?.username)
    const { data: BookingData, loading: BookingLoading, error: ErrorBooking } = useQuery(QUERY_BOOKING, {
        variables: {
            filters: {
                customers: {
                    username: {
                        eq: user?.username
                    }
                }
            }
        },
        context: {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        }
    })
    if (BookingLoading) {
        return (
            <div className="flex justify-center items-center space-x-2">
                <div className="w-4 h-4 bg-[#F8644B] rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-[#F8644B] rounded-full animate-bounce200"></div>
                <div className="w-4 h-4 bg-[#F8644B] rounded-full animate-bounce400"></div>
            </div>
        )
    }
    if (ErrorBooking) {
        return (
            <p>Error {ErrorBooking}</p>
        )
    }

    console.log(BookingData)
    const transformedPackages = BookingData?.bookings?.map((bk, index) => ({
        index: index,
        fname: bk.fname,
        lname: bk.lname,
        package_name: bk.package?.name,
        package_type: bk.package?.type,
        package_url: bk.package?.thumbnail?.url,
        payment_reciept: bk.payment?.stripe_receipt_url,
        total_price: bk.total_price,
        quantity: bk.quantity,
        date: dayjs(bk.updatedAt).format('DD/MM/YYYY HH:mm:ss'),
        payment_status: (bk.payment?.status_payment === 'Success') ? 'ชำระเงินสำเร็จ' : 'ชำระเงินล้มเหลว',
        booking_status: (bk.booking_status === 'pending') ? 'รอการตรวจสอบ' : (bk.booking_status === 'success') ? 'อนุมัติการจอง' : 'การจองล้มเหลว',
        timetable: `${dayjs(bk?.timetable?.start).format('DD-MM-YYYY')} - ${dayjs(bk?.timetable?.end).format('DD-MM-YYYY')}`
    })) || [];
    console.log(transformedPackages)


    return (
        <div className='p-5 sm:p-15 lg:p-20 xl:p-30'>
            <div className="border-b border-gray-200 pb-10">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">สถานะและประวัติการจอง</h1>
                <p className="mt-4 text-lg text-gray-500">
                    คุณสามารถตรวจสอบรายละเอียดเกี่ยวกับสถานะการจองและประวัติการเดินทางทั้งหมดที่คุณได้ทำการจองไว้ ผ่านทางหน้านี้
                </p>
            </div>
            <ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2 xl:grid-cols-3 xl:gap-x-8 mt-10">
                {transformedPackages.map((booking) => (
                    <li key={booking.index} className="overflow-hidden rounded-xl border border-gray-200">
                        <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                            <img
                                src={`${strapiBaseURL}${booking.package_url}`}
                                className="size-36 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
                            />
                            <div className="text-2xl font-normal text-gray-900">{booking.package_name}</div>
                            <Menu as="div" className="relative ml-auto">
                                <MenuButton className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">Open options</span>
                                    <EllipsisHorizontalIcon aria-hidden="true" className="size-5" />
                                </MenuButton>
                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 ring-1 shadow-lg ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                >
                                    <MenuItem>
                                        <a
                                            href="#"
                                            className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                                        >
                                            ยกเลิก<span className="sr-only">,</span>
                                        </a>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>
                        <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm/6">
                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500 text-lg">ชื่อผู้จอง</dt>
                                <dd className="text-gray-700">
                                    <p className='text-lg'>{`${booking.fname} ${booking.lname}`}</p>
                                </dd>
                            </div>
                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500 text-lg">จำนวน</dt>
                                <dd className="text-gray-700">
                                    <p className='text-lg'>{`${booking.quantity} คน`}</p>
                                </dd>
                            </div>
                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500 text-lg">สถานะการชำระเงิน</dt>
                                <dd className="text-gray-700">
                                    {(booking.payment_status) === "ชำระเงินสำเร็จ" ? (
                                        <p className='text-lg text-green-600 font-medium'>{`${booking.payment_status}`}</p>) :
                                        <p className='text-lg text-red-600 font-medium'>{`${booking.payment_status}`}</p>
                                    }

                                </dd>
                            </div>
                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500 text-lg">สถานะอนุมัติการจอง</dt>
                                <dd className="text-gray-700">
                                    {(booking.booking_status) === "อนุมัติการจอง" ? (
                                        <p className='text-lg text-green-600 font-medium'>{`${booking.booking_status}`}</p>) :
                                        <p className='text-lg text-yellow-600 font-medium'>{`${booking.booking_status}`}</p>
                                    }
                                </dd>
                            </div>
                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500 text-lg">จำนวนเงิน</dt>
                                <dd className="flex items-start gap-x-2">
                                    <div className="font-medium text-green-600 text-lg">{booking.total_price} บาท</div>
                                    {/* <div
                                        className={classNames(
                                            statuses[client.lastInvoice.status],
                                            'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                                        )}
                                    >
                                        {client.lastInvoice.status}
                                    </div> */}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500 text-lg">เวลาที่จอง</dt>
                                <dd className="text-gray-700">
                                    <p className='text-lg'>{`${booking.date}`}</p>
                                </dd>
                            </div>
                            {(booking.timetable) &&
                                <div className="flex justify-between gap-x-4 py-3">
                                    <dt className="text-gray-500 text-lg">รอบทัวร์</dt>
                                    <dd className="text-gray-700">
                                        <p className='text-lg'>{booking.timetable}</p>
                                    </dd>
                                </div>
                            }

                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500 text-lg">ใบเสร็จ</dt>
                                <dd className="text-gray-700">
                                    <p className='text-lg text-green-600 cursor-pointer' onClick={() => { window.open(booking.payment_reciept) }}>รับใบเสร็จ</p>
                                </dd>
                            </div>
                        </dl>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default Status