import React from 'react';
import { motion } from 'framer-motion';

const ErrorBoundary = ({ error, onRetry, title = "Something went wrong" }) => {
  if (!error) return null;

  const getErrorMessage = (error) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error;
      
      switch (status) {
        case 400:
          return {
            title: "Invalid Request",
            message: message || "Please check your input and try again.",
            action: "Please review your data and try again."
          };
        case 401:
          return {
            title: "Authentication Required",
            message: "Your session has expired. Please log in again.",
            action: "Please log in to continue."
          };
        case 403:
          return {
            title: "Access Denied",
            message: "You don't have permission to access this resource.",
            action: "Please contact support if you believe this is an error."
          };
        case 404:
          return {
            title: "Not Found",
            message: "The requested resource was not found.",
            action: "Please check the URL or try again later."
          };
        case 429:
          return {
            title: "Too Many Requests",
            message: "You've made too many requests. Please wait a moment.",
            action: "Please wait a few minutes before trying again."
          };
        case 500:
          return {
            title: "Server Error",
            message: "Our servers are experiencing issues. Please try again later.",
            action: "Please try again in a few minutes."
          };
        default:
          return {
            title: "Request Failed",
            message: message || "An unexpected error occurred.",
            action: "Please try again or contact support."
          };
      }
    } else if (error.request) {
      // Network error
      return {
        title: "Connection Error",
        message: "Unable to connect to our servers. Please check your internet connection.",
        action: "Please check your internet connection and try again."
      };
    } else {
      // Other error
      return {
        title: "Unexpected Error",
        message: error.message || "Something went wrong.",
        action: "Please try again or contact support."
      };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-red-200 p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-6xl mb-6"
        >
          {error.response?.status === 401 ? "🔐" : 
           error.response?.status === 404 ? "🔍" : 
           error.response?.status >= 500 ? "🚨" : "⚠️"}
        </motion.div>
        
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          {errorInfo.title}
        </h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {errorInfo.message}
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          {errorInfo.action}
        </p>
        
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Try Again
          </motion.button>
        )}
        
        {error.response?.status === 401 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/login'}
            className="ml-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Go to Login
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorBoundary;
