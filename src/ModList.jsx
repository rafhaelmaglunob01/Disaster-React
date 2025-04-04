import React, { useEffect, useState } from "react";
import axios from "axios";

function ModList(){
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const role = localStorage.getItem("userRole")?.toLowerCase();
                console.log("Fetching users with role:", role);

                const response = await axios.get(`http://localhost:5000/api/auth/mods/${role}`);
                console.log("Fetched users from API:", response.data);
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleBan = async (userEmail, isBanned) => {
        try {
            const endpoint = isBanned
                ? `http://localhost:5000/api/auth/users/unban/${userEmail}`
                : `http://localhost:5000/api/auth/users/ban/${userEmail}`;

            await axios.post(endpoint);
            
            setUsers(users.map(user =>
                user.email === userEmail ? { ...user, status: isBanned ? "active" : "banned" } : user
            ));
        } catch (error) {
            console.error("Error banning/unbanning user:", error);
        }
    };
    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-6xl w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Admin Panel - Moderator Management
                </h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 border">ID</th>
                                <th className="py-2 px-4 border">User</th>
                                <th className="py-2 px-4 border">Email</th>
                                <th className="py-2 px-4 border">Created At</th>
                                <th className="py-2 px-4 border">Updated At</th>
                                <th className="py-2 px-4 border">Status</th>
                                <th className="py-2 px-4 border">Last Login</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id || user.email || index} className="border-t">
                                    <td className="py-2 px-4 border">{index + 1}</td>
                                    <td className="py-2 px-4 border">{user.username}</td>
                                    <td className="py-2 px-4 border">{user.email}</td>
                                    <td className="py-2 px-4 border">{user.createdAt}</td>
                                    <td className="py-2 px-4 border">{user.updatedAt}</td>
                                    <td className="py-2 px-4 border">{user.status}</td>
                                    <td className="py-2 px-4 border">{user.last_login || "Never logged in"}</td>
                                    <td className="py-2 px-4 border">
                                        <button
                                            className={`px-4 py-1 rounded cursor-pointer ${
                                                user.status === "banned" ? "bg-green-500" : "bg-red-500"
                                            } text-white`}
                                            onClick={() => handleBan(user.email, user.status === "banned")}
                                        >
                                            {user.status === "banned" ? "Unban" : "Ban"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    )
}

export default ModList;