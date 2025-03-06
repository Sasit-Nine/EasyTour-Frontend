import React, { useState, useEffect } from 'react';

/**
 * Filtering utility for customer management
 * Provides search functionality across customer booking data
 */
const useFilterCustomer = () => {
  // State for the search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for the original and filtered booking lists
  const [originalBookings, setOriginalBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);

  // Update the search query
  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  // Set the original bookings data
  const setBookings = (bookings) => {
    setOriginalBookings(bookings);
    setFilteredBookings(bookings);
  };

  // Apply filtering when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      // If search query is empty, show all bookings
      setFilteredBookings(originalBookings);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    
    // Filter bookings based on customer name, booking sequence, or package name
    const filtered = originalBookings.filter((booking, index) => {
      //const bookingIndex = (index + 1).toString();
      const customerName = booking.fullName.toLowerCase();
      const packageName = booking.packageName ? booking.packageName.toLowerCase() : '';
      
      return (
        customerName.includes(query) ||
        //bookingIndex.includes(query) ||
        packageName.includes(query)
      );
    });
    
    setFilteredBookings(filtered);
  }, [searchQuery, originalBookings]);

  return {
    searchQuery,
    updateSearchQuery,
    setBookings,
    filteredBookings
  };
};

export default useFilterCustomer;