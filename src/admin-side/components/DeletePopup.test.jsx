import { render, screen, fireEvent } from "@testing-library/react";
import DeletePopup from "./DeletePopup";
import '@testing-library/jest-dom';

describe("DeletePopup Component", () => {
  test("ไม่ควรแสดง Popup เมื่อ isOpen เป็น false", () => {
    render(<DeletePopup isOpen={false} />);
    const popup = screen.queryByText("คุณต้องการยืนยันการลบแพ็คเกจทัวร์ใช่หรือไม่");
    expect(popup).not.toBeInTheDocument();
  });

  test("ควรแสดง Popup เมื่อ isOpen เป็น true", () => {
    render(<DeletePopup isOpen={true} title="ลบแพ็คเกจ" />);
    expect(screen.getByText("ลบแพ็คเกจ")).toBeInTheDocument();
    expect(screen.getByText("คุณต้องการยืนยันการลบแพ็คเกจทัวร์ใช่หรือไม่")).toBeInTheDocument();
  });

  test("เรียกใช้งาน onClose เมื่อกดปุ่ม ยกเลิก", () => {
    const handleClose = jest.fn();
    render(<DeletePopup isOpen={true} onClose={handleClose} />);
    
    fireEvent.click(screen.getByText("ยกเลิก"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("เรียกใช้งาน onClose เมื่อคลิกนอก Popup", () => {
    const handleClose = jest.fn();
    render(<DeletePopup isOpen={true} onClose={handleClose} />);

    const overlay = screen.getByTestId("popup-overlay");
    fireEvent.click(overlay);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("เรียกใช้งาน onConfirm เมื่อกดปุ่ม ยืนยัน", () => {
    const handleConfirm = jest.fn();
    render(<DeletePopup isOpen={true} onConfirm={handleConfirm} />);
    
    fireEvent.click(screen.getByText("ยืนยัน"));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });
});
