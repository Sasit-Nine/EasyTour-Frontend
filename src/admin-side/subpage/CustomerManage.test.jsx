import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import CustomerManage from './CustomerManage';
import { QUERY_BOOKING, MUTATION_APPROVE } from '../../services/Graphql';

// Mock components
jest.mock('../components/ViewDetail', () => ({ visible, booking }) => (
  visible ? <div data-testid="view-detail-modal">{booking.fullName}</div> : null
));

jest.mock('../components/ConfirmationModal', () => ({ 
  isOpen, 
  onConfirm, 
  onClose, 
  action 
}) => {
  return isOpen ? (
    <div data-testid="confirmation-modal">
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  ) : null;
});

// Mock hooks
jest.mock('../components/AdminLayout', () => ({
  useSearch: () => ({
    searchQuery: ''
  })
}));

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(() => 'mock-token')
};
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage
});

const mocks = [
  {
    request: {
      query: QUERY_BOOKING,
      variables: {
        filters: { booking_status: { eq: "pending" } }
      },
      context: {
        headers: { Authorization: "Bearer mock-token" }
      }
    },
    result: {
      data: {
        bookings: [
          {
            documentId: '1',
            fname: 'John',
            lname: 'Doe',
            package: { name: 'Premium Package' },
            tel: '0812345678',
            address: '123 Street',
            city: 'Bangkok',
            district: 'Pathumwan',
            province: 'Bangkok',
            payment: { 
              stripe_receipt_url: 'http://receipt.url',
              status_payment: 'ชำระเงินสำเร็จ' 
            },
            total_price: 5000,
            quantity: 2,
            booking_status: 'pending',
            updatedAt: '2024-05-01T00:00:00Z',
            createdAt: '2024-05-01T00:00:00Z'
          }
        ]
      }
    }
  },
  {
    request: {
      query: MUTATION_APPROVE,
      variables: {
        documentId: '1',
        data: { booking_status: "success" }
      },
      context: {
        headers: { Authorization: "Bearer mock-token" }
      }
    },
    result: { data: {} }
  }
];

describe('CustomerManage', () => {
  it('renders loading state', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CustomerManage />
      </MockedProvider>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitFor(() => {});
  });

  it('displays error message', async () => {
    const errorMock = {
      request: {
        query: QUERY_BOOKING,
        variables: {
          filters: { booking_status: { eq: "pending" } }
        },
        context: {
          headers: { Authorization: "Bearer mock-token" }
        }
      },
      error: new Error('An error occurred')
    };

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <CustomerManage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error: An error occurred/i)).toBeInTheDocument();
    });
  });

  it('renders booking data correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CustomerManage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Premium Package')).toBeInTheDocument();
      expect(screen.getByText('ชำระเงินสำเร็จ')).toBeInTheDocument();
      expect(screen.getByText('รอการอนุมัติ')).toBeInTheDocument();
    });
  });

  it('opens approve confirmation modal and triggers mutation', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CustomerManage />
      </MockedProvider>
    );

    await waitFor(() => {
      userEvent.click(screen.getByText('อนุมัติ'));
    });

    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
    userEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument();
    });
  });

  it('opens view details modal', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CustomerManage />
      </MockedProvider>
    );

    await waitFor(() => {
      userEvent.click(screen.getByText('ดูเพิ่มเติม'));
    });

    expect(screen.getByTestId('view-detail-modal')).toHaveTextContent('John Doe');
  });

  it('filters bookings based on search query', async () => {
    // Override useSearch mock
    jest.spyOn(require('../components/AdminLayout'), 'useSearch').mockImplementation(() => ({
      searchQuery: 'Premium'
    }));

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CustomerManage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Premium Package')).toBeInTheDocument();
    });
  });
});