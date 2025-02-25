import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

const ViewDetail = ({ visible, onCancel, booking }) => {
  if (!booking) return null
  console.log(booking)

  return (
    <Dialog open={visible} onClose={onCancel} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto flex items-center justify-center p-4">
        <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-6 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="text-center">
            <DialogTitle as="h3" className="text-xl font-semibold text-gray-900">
                รายละเอียดการจอง
            </DialogTitle>
          </div>

          <div className="mt-4 space-y-2 text-base text-gray-700">
            <p><strong>แพ็กเกจทัวร์ : </strong> {booking.packageName}</p>
            <p><strong>ชื่อลูกค้า : </strong> {booking.fullName}</p>
            <p><strong>เบอร์ติดต่อ : </strong> {booking.tel}</p>
            <p><strong>ที่อยู่ : </strong> {booking.address} {booking.city} {booking.district} {booking.province}</p>
            <p><strong>จำนวนลูกค้าทัวร์ : </strong> {booking.quantity} คน</p>
            <p><strong>ราคา : </strong> ฿{booking.total_price}</p>
            <p><strong>สถานะการจอง : </strong> 
              <span className={`px-2 py-1 text-base rounded ${booking.status === "success" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {(booking.status==="pending")?'รอการอนุมัติ':(booking.status==='success')?'อนุมัติการจอง':'ปฏิเสธการจอง'}
              </span>
            </p>
            <p><strong>สถานะการชำระเงิน : </strong> 
              <span className={`px-2 py-1 text-base rounded ${booking.paymentStatus === "Success" ? "bg-green-100 text-green-700" : booking.paymentStatus === "Pending" ? "bg-red-100 text-red-700":"bg-yellow-100 text-yellow-700"}`}>
                {(booking.paymentStatus==="Pending")?'รอการชำระเงิน':(booking.paymentStatus==='Success')?'ชำระเงินเรียบร้อย':'ปฏิเสธการจอง'}
              </span>
            </p>
            <p><strong>เวลาที่จอง : </strong> {booking.bookingTime}</p>
            {(booking.Reciep)&&<p><strong>ใบเสร็จ : </strong> <button className="cursor-pointer text-[#F8644B]" onClick={()=>{window.open(booking.Reciep)}}>ดูใบเสร็จ</button></p>}
            
          </div>

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex w-full justify-center rounded-md bg-[#F8644B] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#F8644B]/80 sm:col-start-2"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ViewDetail;
