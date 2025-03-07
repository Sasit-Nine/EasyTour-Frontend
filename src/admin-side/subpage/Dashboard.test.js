import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import { useQuery } from '@apollo/client';
import { QUERY_BOOKING } from '../../services/Graphql';
import '@testing-library/jest-dom';

// Mock useQuery และ sessionStorage
jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn(),
}));

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(() => 'fake-token'),
  },
  writable: true,
});

describe('Dashboard Component', () => {
  const mockBookings = [
    {
      id: 1,
      fname: 'John',
      lname: 'Doe',
      package: { name: 'Package 1' },
      createdAt: '2024-05-01T00:00:00Z',
      booking_status: { status: 'pending' },
      total_price: 1000,
    },
    {
      id: 2,
      fname: 'Jane',
      lname: 'Smith',
      package: { name: 'Package 2' },
      createdAt: '2024-05-02T00:00:00Z',
      booking_status: { status: 'confirmed' },
      total_price: 2000,
    },
  ];

  beforeEach(() => {
    useQuery.mockReset();
    window.sessionStorage.getItem.mockClear();
  });

  it('แสดง Loading Spinner เมื่อกำลังโหลดข้อมูล', () => {
    useQuery.mockReturnValue({ loading: true });
    render(<Dashboard />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('แสดงข้อผิดพลาดเมื่อเกิด Error', () => {
    const errorMessage = 'เกิดข้อผิดพลาด';
    useQuery.mockReturnValue({ error: { message: errorMessage } });
    render(<Dashboard />);
    expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('แสดงข้อความ "No bookings found" เมื่อไม่มีข้อมูล', () => {
    useQuery.mockReturnValue({ data: { bookings: [] } });
    render(<Dashboard />);
    expect(screen.getByText(/No bookings found/i)).toBeInTheDocument();
  });
});