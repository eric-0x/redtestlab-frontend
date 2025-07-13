"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  BarChart4, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Tag,
  User,
  Filter,
  Clock,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  X
} from 'lucide-react';

// Define TypeScript interfaces
interface BookingUser {
  id: number;
  name: string;
  email: string;
}

interface Booking {
  id: number;
  amount: number;
  status: string;
  createdAt: string;
  bookingType: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  user: BookingUser;
}

interface Booking {
  bookingType: string;
  // ... other properties
}

interface MonthData {
  totalBookings: number;
  totalRevenue: number;
  paidBookings: number;
  topBookingType: string;
  dailyBookings: Record<number, number>;
  dailyRevenue: Record<number, number>;
  percentChange: number;
}

export default function MonthlyOverview() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedMonth, setSelectedMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedBookingType, setSelectedBookingType] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // For booking type filter
  const [bookingTypes, setBookingTypes] = useState<string[]>([]);

  useEffect(() => {
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://redtestlab.com/api/bookings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data: Booking[] = await response.json();
      setBookings(data);

      // Extract unique booking types with proper typing
      const bookingTypeSet: Set<string> = new Set(data.map((booking) => booking.bookingType));
      const types: string[] = ["All", ...Array.from(bookingTypeSet)];
      setBookingTypes(types);

      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  fetchBookings();
}, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get month name and year
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Navigate to previous month
  const goToPrevMonth = () => {
    setSelectedMonth(prev => {
      const prevMonth = new Date(prev);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      return prevMonth;
    });
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setSelectedMonth(prev => {
      const nextMonth = new Date(prev);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    });
  };

  // Get filtered bookings for selected month
  const filteredBookings = useMemo(() => {
    if (!bookings.length) return [];
    
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    
    let filtered = bookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate.getFullYear() === year && bookingDate.getMonth() === month;
    });
    
    if (selectedBookingType !== "All") {
      filtered = filtered.filter(booking => booking.bookingType === selectedBookingType);
    }
    
    return filtered;
  }, [bookings, selectedMonth, selectedBookingType]);

  // Calculate monthly statistics
  const monthlyData = useMemo((): MonthData => {
    if (!filteredBookings.length) {
      return {
        totalBookings: 0,
        totalRevenue: 0,
        paidBookings: 0,
        topBookingType: 'N/A',
        dailyBookings: {},
        dailyRevenue: {},
        percentChange: 0
      };
    }

    // Get previous month data for comparison
    const prevMonth = new Date(selectedMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevYear = prevMonth.getFullYear();
    const prevMonthNum = prevMonth.getMonth();
    
    const prevMonthBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate.getFullYear() === prevYear && bookingDate.getMonth() === prevMonthNum;
    });

    // Calculate top booking type
    const typeCount: Record<string, number> = {};
    filteredBookings.forEach(booking => {
      if (booking.bookingType) {
        typeCount[booking.bookingType] = (typeCount[booking.bookingType] || 0) + 1;
      }
    });

    let topType = 'N/A';
    let maxCount = 0;
    
    Object.entries(typeCount).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topType = type;
      }
    });

    // Calculate daily booking and revenue distribution
    const dailyBookings: Record<number, number> = {};
    const dailyRevenue: Record<number, number> = {};
    
    // Initialize all days of the month to 0
    const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      dailyBookings[i] = 0;
      dailyRevenue[i] = 0;
    }
    
    filteredBookings.forEach(booking => {
      const date = new Date(booking.createdAt);
      const day = date.getDate();
      
      dailyBookings[day] = (dailyBookings[day] || 0) + 1;
      dailyRevenue[day] = (dailyRevenue[day] || 0) + booking.amount;
    });
    
    // Calculate percentage change from previous month
    const currentRevenue = filteredBookings.reduce((sum, booking) => sum + booking.amount, 0);
    const prevRevenue = prevMonthBookings.reduce((sum, booking) => sum + booking.amount, 0);
    
    let percentChange = 0;
    if (prevRevenue > 0) {
      percentChange = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
    }

    return {
      totalBookings: filteredBookings.length,
      totalRevenue: filteredBookings.reduce((sum, booking) => sum + booking.amount, 0),
      paidBookings: filteredBookings.filter(b => b.status === 'PAID').length,
      topBookingType: topType,
      dailyBookings,
      dailyRevenue,
      percentChange
    };
  }, [filteredBookings, bookings, selectedMonth]);

  // Handle mock export functionality
  const handleExport = () => {
    alert(`Exporting ${getMonthName(selectedMonth)} bookings data...`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 w-full bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-600 font-medium">Loading monthly data...</p>
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
    <div className="max-w-7xl mx-auto p-4 bg-gray-50 rounded-xl shadow-lg">
      {/* Header with Month Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">Booking Overview</h1>
          <p className="text-gray-600 mt-1">Booking and revenue analysis</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button 
            onClick={goToPrevMonth}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 flex items-center">
            <Calendar size={18} className="mr-2 text-blue-600" />
            <span className="font-medium text-gray-800">{getMonthName(selectedMonth)}</span>
          </div>
          
          <button 
            onClick={goToNextMonth}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
          
          <div className="ml-2 relative">
            {/* <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg transition"
            >
              <Filter size={16} className="mr-2" />
              <span className="font-medium">Filters</span>
            </button> */}
            
            {showFilters && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-3">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2">
                  <span className="font-medium text-gray-800">Filters</span>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking Type
                  </label>
                  <select
                    value={selectedBookingType}
                    onChange={(e) => setSelectedBookingType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {bookingTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          
          {/* <button 
            onClick={handleExport}
            className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition ml-2"
          >
            <Download size={16} className="mr-2" />
            <span className="font-medium">Export</span>
          </button> */}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Bookings */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Bookings</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{monthlyData.totalBookings}</p>
              <div className={`flex items-center mt-2 text-xs font-medium ${monthlyData.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {monthlyData.percentChange >= 0 ? (
                  <ArrowUpRight size={14} className="mr-1" />
                ) : (
                  <ArrowDownRight size={14} className="mr-1" />
                )}
                <span>{Math.abs(Math.round(monthlyData.percentChange))}% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <CreditCard size={24} className="text-blue-700" />
            </div>
          </div>
        </div>
        
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-lg border border-indigo-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-indigo-700">Total Revenue</p>
              <p className="text-2xl font-bold text-indigo-900 mt-1">{formatCurrency(monthlyData.totalRevenue)}</p>
              <div className={`flex items-center mt-2 text-xs font-medium ${monthlyData.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {monthlyData.percentChange >= 0 ? (
                  <ArrowUpRight size={14} className="mr-1" />
                ) : (
                  <ArrowDownRight size={14} className="mr-1" />
                )}
                <span>{Math.abs(Math.round(monthlyData.percentChange))}% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-200 rounded-lg">
              <TrendingUp size={24} className="text-indigo-700" />
            </div>
          </div>
        </div>
        
        {/* Paid Bookings */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-green-700">Paid Bookings</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {monthlyData.paidBookings} 
                <span className="text-sm font-normal text-green-700 ml-1">
                  ({monthlyData.totalBookings > 0 
                    ? Math.round((monthlyData.paidBookings / monthlyData.totalBookings) * 100) 
                    : 0}%)
                </span>
              </p>
              <p className="text-xs text-green-600 mt-2">Successfully processed</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <Check size={24} className="text-green-700" />
            </div>
          </div>
        </div>
        
        {/* Top Booking Type */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-lg border border-amber-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-amber-700">Top Booking Type</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">{monthlyData.topBookingType}</p>
              <p className="text-xs text-amber-600 mt-2">Most popular this month</p>
            </div>
            <div className="p-3 bg-amber-200 rounded-lg">
              <Tag size={24} className="text-amber-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Bookings List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Calendar size={20} className="mr-2 text-blue-600" />
            {getMonthName(selectedMonth)} Bookings
          </h3>
        </div>
        
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Clock size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No bookings found</h3>
            <p className="text-gray-500 text-center mt-2 max-w-md">
              There are no bookings recorded for {getMonthName(selectedMonth)}
              {selectedBookingType !== "All" ? ` with booking type "${selectedBookingType}"` : ''}.
              Try changing your filters or selecting a different month.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop view */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(booking.createdAt)}
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
                        <div className="text-sm font-medium text-blue-900">#{booking.id}</div>
                        <div className="text-xs text-gray-500">{booking.razorpayOrderId.substring(0, 14)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.bookingType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(booking.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Tablet view */}
            <div className="hidden md:block lg:hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
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
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(booking.amount)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Mobile view */}
            <div className="md:hidden space-y-3 p-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                        <User size={16} className="text-blue-700" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-white font-medium">{booking.user.name}</h3>
                        <p className="text-blue-100 text-xs">{formatDate(booking.createdAt)}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Booking ID</span>
                      <span className="text-sm font-medium text-gray-900">#{booking.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Type</span>
                      <span className="text-sm font-medium text-gray-900">{booking.bookingType}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
                      <span className="text-sm text-gray-500">Amount</span>
                      <span className="text-sm font-bold text-blue-800">{formatCurrency(booking.amount)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}