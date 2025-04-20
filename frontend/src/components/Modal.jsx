import React from "react";

const Modal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
        <p className="text-sm text-gray-700 mb-1">Position: {user.position}</p>
        <p className="text-sm mb-3">
          <strong>Bio:</strong> {user.bio}
        </p>
        <p className="text-sm">
          <strong>Status:</strong>{" "}
          {user.isMuted ? "Muted ❌" : "Unmuted ✅"}
        </p>
      </div>
    </div>
  );
};

export default Modal;
