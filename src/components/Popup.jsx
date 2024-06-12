/* eslint-disable react/prop-types */
import { useEffect } from "react";

function Popup({ content, onClose, autoCloseTimeout }) {
  useEffect(() => {
    if (autoCloseTimeout) {
      const timeoutId = setTimeout(() => {
        onClose();
      }, autoCloseTimeout);

      return () => clearTimeout(timeoutId);
    }
  }, [autoCloseTimeout, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-md">
        <button onClick={onClose} className="absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-700">
          &times;
        </button>
        <div>{content}</div>
      </div>
    </div>
  );
}

export default Popup;
