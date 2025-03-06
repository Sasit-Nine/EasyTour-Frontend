import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, action, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* พื้นหลังที่มืดลงแต่ไม่มีสีพื้นหลัง */}
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity" onClick={onClose}></div>

      
      {/* กล่อง modal */}
      <div className="bg-white rounded-lg p-6 max-w-md w-full z-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-white ${
              action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;