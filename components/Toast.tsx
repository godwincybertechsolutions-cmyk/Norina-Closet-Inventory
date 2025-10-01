import React, { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-dismiss after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className="fixed top-5 right-5 bg-green-600 text-white py-2 px-5 rounded-lg shadow-lg z-50 animate-fade-in-down">
      {message}
    </div>
  );
};

// Simple fade-in-down animation for the toast
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in-down {
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-down {
    animation: fade-in-down 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);


export default Toast;