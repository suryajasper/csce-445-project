import React from "react";
import { Mic } from "lucide-react"; // or use your own SVG

const AudienceMember = ({ user, onToggleMute, onClick }) => {
  const shouldShowBubble = user.response && !user.isMuted;

  return (
    <div
      onClick={() => onClick(user)}
      className="relative flex flex-col items-center text-center p-4 cursor-pointer"
    >
      {shouldShowBubble && (
        <div className="absolute -top-6 -right-2 bg-gray-100 text-black text-sm rounded-xl px-3 py-2 max-w-xs shadow border z-10">
          {user.response}
          <div className="absolute -bottom-2 left-3 w-0 h-0 border-t-8 border-t-gray-100 border-l-8 border-l-transparent border-r-8 border-r-transparent" />
        </div>
      )}

      <div className="text-green-700 font-semibold">{user.name}</div>

      <Mic className="w-5 h-5 mt-1 text-black" />
    </div>
  );
};

export default AudienceMember;

