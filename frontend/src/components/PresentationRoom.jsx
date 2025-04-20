import React, { useState, useEffect } from "react";
import { mockAudience } from "../data/mockAudience";
import AudienceMember from "./AudienceMember";
import Modal from "./Modal";

const PresentationRoom = ({ topic }) => {
    const [audience, setAudience] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        setAudience(mockAudience);
    }, []);

    const toggleMute = (id) => {
        setAudience((prev) =>
            prev.map((u) =>
                u.id === id ? { ...u, isMuted: !u.isMuted } : u
            )
        );
    };

    return (
        <div className="p-6 relative">
            <h2 className="text-2xl font-bold mb-2">Presentation Room</h2>
            <p className="text-lg text-gray-700 mb-6 italic">
                Topic: {topic || "No topic chosen"}
            </p>

            <div className="flex flex-wrap justify-center items-start gap-6">
                {audience.map((user) => (
                    <AudienceMember
                        key={user.id}
                        user={user}
                        onToggleMute={toggleMute}
                        onClick={setSelectedUser}
                    />
                ))}
            </div>


            <Modal user={selectedUser} onClose={() => setSelectedUser(null)} />
        </div>
    );
};

export default PresentationRoom;

