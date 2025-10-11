import React, { useState } from 'react';
import validator from 'validator';
import axios from 'axios';
import { useNavigate, Link } from 'react-router';

const AdminSignin = () => {
  const [formData, setFormData] = useState({
    idNumber: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // ID Number validation
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'ID number is required';
    } else if (!validator.isAlphanumeric(formData.idNumber)) {
      newErrors.idNumber = 'ID number should contain only letters and numbers';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/adminAuth/adminSignin`,
          formData,
          { withCredentials: true }
        );

        if (response.status === 200) {
          navigate('/adminDashboard'); 
        }
      } catch (error) {
        console.log("Error signing in: ", error);
        setErrors({ submit: 'Sign in failed! Please check your credentials and try again.' });
      }
    } else {
      setErrors(formErrors);
    }

    setIsSubmitting(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getInputClassName = (fieldName) => {
    const baseClasses = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200";

    if (errors[fieldName]) {
      return `${baseClasses} border-red-500 focus:ring-red-500 bg-red-50`;
    }

    return `${baseClasses} border-gray-300 focus:ring-blue-500`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Left Side - Branding */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-8 lg:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 h-full flex flex-col justify-center">
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold text-lg">H</span>
              </div>
              <h1 className="text-2xl font-bold">Hotel Elite</h1>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Welcome Back
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Sign in to access your hotel management dashboard and continue managing operations.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">✓</span>
                </div>
                <span>Access real-time bookings</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">✓</span>
                </div>
                <span>Manage room inventory</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">✓</span>
                </div>
                <span>View analytics & reports</span>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white bg-opacity-10 rounded-full"></div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="p-8 lg:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Sign In</h2>
            <p className="text-gray-600">Access your administrator account</p>
          </div>

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
                ID Number *
              </label>
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                required
                className={getInputClassName('idNumber')}
                placeholder="Enter your ID number"
              />
              {errors.idNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.idNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={getInputClassName('password') + " pr-10"}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/adminSignup" className="text-blue-600 font-semibold hover:underline">
                Create admin account
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-blue-700">
                <strong>Secure Access:</strong> This portal is for authorized hotel administration personnel only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignin;