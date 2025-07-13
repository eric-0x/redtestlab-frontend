"use client";

import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Chrome, RefreshCw, AlertCircle, Users } from 'lucide-react';

interface UserData {
  id: number;
  name: string | null;
  email: string;
  role: string;
  googleId: string | null;
}

const UserShowcase: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://redtestlab.com/api/user');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'user':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    return role.toLowerCase() === 'admin' ? Shield : User;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
            <span className="text-lg font-medium text-gray-700">Loading users...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">Error Loading Users</h2>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchUsers}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">User Directory</h1>
          <p className="text-xl text-gray-600">Professional user management dashboard</p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="h-1 w-12 bg-blue-600 rounded"></div>
            <div className="h-1 w-6 bg-blue-400 rounded"></div>
            <div className="h-1 w-3 bg-blue-300 rounded"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Administrators</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => user.role.toLowerCase() === 'admin').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Chrome className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Google Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => user.googleId !== null).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => {
            const RoleIcon = getRoleIcon(user.role);
            
            return (
              <div
                key={user.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
              >
                <div className="p-6">
                  {/* User Avatar */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      {user.googleId && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                          <Chrome className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="text-center space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.name || 'No Name Provided'}
                      </h3>
                      {!user.name && (
                        <p className="text-xs text-gray-400 italic">Name not set</p>
                      )}
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm truncate max-w-full" title={user.email}>
                        {user.email}
                      </span>
                    </div>

                    <div className="flex items-center justify-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {user.role}
                      </span>
                    </div>

                    {user.googleId && (
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                          <Chrome className="h-3 w-3" />
                          <span>Google Account Linked</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-4">
                  <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserShowcase;