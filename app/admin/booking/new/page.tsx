"use client";

import { useState, useEffect } from 'react';
import { Clock, CreditCard, CheckCircle, Filter, User, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';

// Define TypeScript interfaces for our data structure
interface BookingUser {
  name: string;
  email: string;
}

interface Booking {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  user: BookingUser;
  createdAt: string;
  amount: number;
  status: string;
  bookingType: string;
}

export default function RecentBookings(): React.ReactNode {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [is24HoursFilter, setIs24HoursFilter] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookings = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch('https://redtestlab.com/api/bookings');
        
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        
        const data = await response.json();
        setBookings(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings in the last 24 hours
  const getFilteredBookings = (): Booking[] => {
    if (!is24HoursFilter) return bookings;
    
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate >= twentyFourHoursAgo;
    });
  };

  const filteredBookings = getFilteredBookings();
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // Format date to a more readable format
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 w-full bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-600 font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg shadow-md">
        <h2 className="text-red-700 text-lg font-semibold mb-2">Error</h2>
        <p className="text-red-600">{error}</p>
        <p className="mt-4 text-red-600">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 rounded-xl shadow-lg">
    
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Recent Bookings</h1>
            <p className="text-gray-600 mt-1">Track all your recent payment activities</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <button 
              onClick={() => setIs24HoursFilter(!is24HoursFilter)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${
                is24HoursFilter 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter size={16} className="mr-2" />
              {is24HoursFilter ? 'Last 24 Hours' : 'All Bookings'}
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-200 rounded-lg">
                <CreditCard size={20} className="text-blue-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-700">Total Bookings</p>
                <p className="text-xl font-bold text-blue-900">{filteredBookings.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-200 rounded-lg">
                <CheckCircle size={20} className="text-blue-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-700">Payment Status</p>
                <p className="text-xl font-bold text-blue-900">
                  {filteredBookings.filter(b => b.status === 'PAID').length} Paid
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-200 rounded-lg">
                <Calendar size={20} className="text-blue-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-700">Period</p>
                <p className="text-xl font-bold text-blue-900">
                  {is24HoursFilter ? 'Last 24 Hours' : 'All Time'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {currentItems.length === 0 ? (
          <div className="text-center py-12 bg-blue-50 rounded-lg">
            <Clock size={48} className="mx-auto text-blue-300 mb-4" />
            <h3 className="text-lg font-medium text-blue-800">No bookings found</h3>
            <p className="text-blue-600 mt-1">
              {is24HoursFilter 
                ? 'No bookings were made in the last 24 hours' 
                : 'No bookings available'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop view - Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider rounded-tl-lg">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider rounded-tr-lg">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((booking) => (
                    <tr key={booking.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-900">#{booking.id}</div>
                        <div className="text-xs text-gray-500">{booking.razorpayOrderId.substring(0, 14)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User size={16} className="text-blue-700" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{booking.user.name}</div>
                            <div className="text-xs text-gray-500">{booking.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(booking.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{formatCurrency(booking.amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.bookingType}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Mobile view - Cards */}
            <div className="md:hidden space-y-4">
              {currentItems.map((booking) => (
                <div key={booking.id} className="bg-white border border-blue-100 rounded-xl shadow-sm overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                        <User size={20} className="text-blue-700" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-white font-medium text-lg">{booking.user.name}</h3>
                        <p className="text-blue-100 text-sm">{booking.user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between">
                      <div className="text-sm text-gray-600">Booking ID</div>
                      <div className="text-sm font-medium text-gray-900">
                        #{booking.id} <span className="text-xs text-gray-500 font-normal ml-1">({booking.razorpayOrderId.substring(0, 10)}...)</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="text-sm text-gray-600">Date</div>
                      <div className="text-sm font-medium text-gray-900">{formatDate(booking.createdAt)}</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="text-sm text-gray-600">Type</div>
                      <div className="text-sm font-medium text-gray-900">{booking.bookingType}</div>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div className="text-xs uppercase text-gray-500 font-medium">Amount</div>
                        <div className="text-lg font-bold text-blue-800">{formatCurrency(booking.amount)}</div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">Payment ID</div>
                        <div className="text-xs font-medium text-gray-600">{booking.razorpayPaymentId.substring(0, 16)}...</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {filteredBookings.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredBookings.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredBookings.length}</span> bookings
                </p>
              </div>
              <div className="flex items-center">
                <select 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="mr-4 rounded-md border border-gray-300 py-1 px-2 text-sm"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                </select>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold 
                        ${currentPage === page
                          ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
   
  );
}