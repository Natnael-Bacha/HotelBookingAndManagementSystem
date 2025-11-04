import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useRoomStore } from '../store';
import axios from 'axios';

const AdminDashboard = () => {
  const { rooms, loading, error, fetchRooms } = useRoomStore();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    available: '',
    petFriendly: '',
    roomStandard: ''
  });

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
  
     await axios.post(`${import.meta.env.VITE_BACKEND_URL}/adminAuth/logout`, {} , {withCredentials: true});

    
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      sessionStorage.removeItem('token');
      
  
      navigate('/');
      
    } catch (error) {
      console.error('Logout error:', error);
      
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = async () => {
    const cleanFilters = {};
    
    if (filters.available !== '') {
      cleanFilters.available = filters.available === 'true';
    }
    if (filters.petFriendly !== '') {
      cleanFilters.petFriendly = filters.petFriendly === 'true';
    }
    if (filters.roomStandard !== '') {
      cleanFilters.roomStandard = filters.roomStandard;
    }

    await fetchRooms(cleanFilters);
  };

  const clearFilters = async () => {
    setFilters({
      available: '',
      petFriendly: '',
      roomStandard: ''
    });
    await fetchRooms();
  };
  
  const validRooms = (rooms || []).filter((room) => room && room !== null);

  const getRoomStandardColor = (standard) => {
    switch (standard.toLowerCase()) {
      case 'deluxe': return 'from-purple-600 to-pink-500';
      case 'suite': return 'from-amber-600 to-orange-500';
      case 'premium': return 'from-emerald-600 to-teal-500';
      case 'standard': return 'from-blue-600 to-cyan-500';
      default: return 'from-slate-600 to-blue-500';
    }
  };

  const getRoomStandardIcon = (standard) => {
    switch (standard.toLowerCase()) {
      case 'deluxe': return '🏰';
      case 'suite': return '⭐';
      case 'premium': return '✨';
      case 'standard': return '🛏️';
      default: return '🏨';
    }
  };

  const getStatusBadge = (room) => {
    if (!room.available) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-red-700 text-sm font-medium">Occupied</span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-green-700 text-sm font-medium">Available</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-700 font-medium text-lg">Loading Luxury Rooms...</p>
          <p className="text-slate-500 text-sm mt-2">Preparing your hotel management experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Luxury Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                  Hotel Elite
                </h1>
                <p className="text-slate-600 text-sm">Luxury Room Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 border border-red-400 hover:border-red-500 hover:shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                )}
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>

              {/* Admin Profile Button */}
              <button className="bg-white/80 hover:bg-white text-slate-700 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 border border-slate-200/60 hover:border-slate-300 hover:shadow-lg flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
          <p className="text-slate-600 text-lg">Manage your luxury hotel rooms with elegance</p>
        </div>

        {/* Luxury Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">Total Rooms</p>
                <p className="text-3xl font-bold text-slate-800">{validRooms.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🏨</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-green-600 text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                All luxury suites
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">Available</p>
                <p className="text-3xl font-bold text-slate-800">
                  {validRooms.filter(room => room.available).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">✅</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-blue-600 text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L12 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Ready for guests
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">Occupied</p>
                <p className="text-3xl font-bold text-slate-800">
                  {validRooms.filter(room => !room.available).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🔒</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-amber-600 text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Currently booked
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">Pet Friendly</p>
                <p className="text-3xl font-bold text-slate-800">
                  {validRooms.filter(room => room.petFriendly).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🐾</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-purple-600 text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Pet accommodations
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Room Filters</h2>
              <p className="text-slate-600 mt-1">Find exactly what you're looking for</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button
                onClick={clearFilters}
                disabled={loading}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 border border-slate-200/60 hover:border-slate-300 hover:shadow-lg flex items-center space-x-2 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Clear Filters</span>
              </button>
              <button
                onClick={applyFilters}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Apply Filters</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Availability Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Availability
              </label>
              <select 
                value={filters.available}
                onChange={(e) => handleFilterChange('available', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Rooms</option>
                <option value="true">Available Only</option>
                <option value="false">Occupied Only</option>
              </select>
            </div>

            {/* Pet Friendly Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Pet Policy
              </label>
              <select 
                value={filters.petFriendly}
                onChange={(e) => handleFilterChange('petFriendly', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Policies</option>
                <option value="true">Pet Friendly Only</option>
                <option value="false">Not Pet Friendly</option>
              </select>
            </div>

            {/* Room Standard Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Room Standard
              </label>
              <select 
                value={filters.roomStandard}
                onChange={(e) => handleFilterChange('roomStandard', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Standards</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="suite">Suite</option>
                <option value="deluxe">Deluxe</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.available !== '' || filters.petFriendly !== '' || filters.roomStandard !== '') && (
            <div className="mt-6 pt-6 border-t border-slate-200/60">
              <p className="text-sm text-slate-600 mb-3">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {filters.available !== '' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {filters.available === 'true' ? 'Available' : 'Occupied'}
                    <button 
                      onClick={() => handleFilterChange('available', '')}
                      className="ml-2 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.petFriendly !== '' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {filters.petFriendly === 'true' ? 'Pet Friendly' : 'Not Pet Friendly'}
                    <button 
                      onClick={() => handleFilterChange('petFriendly', '')}
                      className="ml-2 hover:text-green-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.roomStandard !== '' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {filters.roomStandard}
                    <button 
                      onClick={() => handleFilterChange('roomStandard', '')}
                      className="ml-2 hover:text-purple-600"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Luxury Room Collection</h2>
            <p className="text-slate-600 mt-1">
              {validRooms.length} room{validRooms.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <button
            onClick={() => navigate('/createRoom')}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg flex items-center space-x-3 group"
          >
            <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span>Create New Room</span>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-6 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-red-800 font-medium">Unable to load rooms</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Luxury Rooms Grid */}
        {validRooms.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-16 text-center border border-slate-200/60 shadow-sm">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <span className="text-4xl">🏨</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                {Object.values(filters).some(filter => filter !== '') 
                  ? "No Rooms Match Your Filters" 
                  : "No Luxury Rooms Yet"
                }
              </h3>
              <p className="text-slate-600 text-lg mb-8">
                {Object.values(filters).some(filter => filter !== '')
                  ? "Try adjusting your filters to see more rooms"
                  : "Begin your journey by creating the first exquisite room for your guests"
                }
              </p>
              {Object.values(filters).some(filter => filter !== '') ? (
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-4 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
                >
                  Clear All Filters
                </button>
              ) : (
                <button
                  onClick={() => navigate('/createRoom')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-4 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
                >
                  Create First Luxury Room
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {validRooms.map((room) => (
              <div key={room._id} className="group">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105">
                  {/* Room Header with Gradient */}
                  <div className={`relative bg-gradient-to-r ${getRoomStandardColor(room.roomStandard)} p-6 text-white overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-2xl">{getRoomStandardIcon(room.roomStandard)}</span>
                            <h3 className="text-xl font-bold">Room {room.roomNumber}</h3>
                          </div>
                          <p className="text-blue-100 text-sm font-medium capitalize">{room.roomStandard} Suite</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">${room.roomPrice}</p>
                          <p className="text-blue-100 text-xs">per night</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      {getStatusBadge(room)}
                      {room.petFriendly && (
                        <div className="flex items-center space-x-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                          <span className="text-amber-700 text-sm font-medium">🐾 Pet Friendly</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 text-sm">🛏️</span>
                          </div>
                          <span className="text-slate-700 font-medium">Beds</span>
                        </div>
                        <span className="text-slate-900 font-semibold">{room.numberOfBeds}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-purple-600 text-sm">⭐</span>
                          </div>
                          <span className="text-slate-700 font-medium">Standard</span>
                        </div>
                        <span className="text-slate-900 font-semibold capitalize">{room.roomStandard}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-200/60">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">
                          Updated {new Date(room.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Luxury Footer */}
      <footer className="mt-16 border-t border-slate-200/60 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-slate-700 font-semibold">Hotel Elite</span>
            </div>
            <div className="text-slate-600 text-sm">
              Luxury Hotel Management System © 2025
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;