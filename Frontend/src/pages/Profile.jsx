
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../api"

function Profile() {

    const navigate = useNavigate()

    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)
    const [error, seterror] = useState("")

    const [name, setname] = useState("")
    const [email, setemail] = useState("")

    const [currentPassword, setcurrentPassword] = useState("")
    const [newPassword, setnewPassword] = useState("")

    const token = localStorage.getItem("token")

    // Get User Profile
    useEffect(() => {

        async function getProfile() {

            try {
                const response = await fetch(`${API_URL}/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.detail || "Failed to load profile")
                }

                setuser(data)
                setname(data.name)
                setemail(data.email)

            } catch (error) {
                seterror(error.message)
            } finally {
                setloading(false)
            }
        }

        getProfile()

    }, [token])


    // Update Name and Email
    async function updateProfile(e) {

        e.preventDefault()

        try {
            const response = await fetch(`${API_URL}/users/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: name,
                    email: email
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.detail || "Profile update failed")
            }

            setuser(data)
            alert("Profile updated successfully!")

        } catch (error) {
            alert(error.message)
        }
    }


    // Change Password
    async function changePassword(e) {

        e.preventDefault()

        try {
            const response = await fetch(`${API_URL}/users/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.detail || "Password change failed")
            }

            alert("Password changed successfully!")

            setcurrentPassword("")
            setnewPassword("")

        } catch (error) {
            alert(error.message)
        }
    }


    // Delete Account
    async function deleteAccount() {

        const confirmDelete = window.confirm(
            "Are you sure? Your account and all related data will be permanently deleted!"
        )

        if (!confirmDelete) {
            return
        }

        try {
            const response = await fetch(`${API_URL}/users/delete`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.detail || "Account deletion failed")
            }

            alert("Account deleted successfully!")

            localStorage.removeItem("token")
            navigate("/register")

        } catch (error) {
            alert(error.message)
        }
    }


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <h2 className="text-lg font-semibold text-gray-600">
                    Loading Profile...
                </h2>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <h2 className="text-red-600 font-semibold">
                    {error}
                </h2>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <h2 className="text-gray-600 font-semibold">
                    User profile not found
                </h2>
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">

            <div className="max-w-3xl mx-auto">

                {/* Page Heading */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-900">
                        My Profile
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage your personal information and account settings.
                    </p>

                </div>


                {/* User Information */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">

                    <div className="mb-6">

                        <h2 className="text-xl font-bold text-gray-900">
                            User Information
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Update your name and email address.
                        </p>

                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">

                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">User ID:</span> {user.id}
                        </p>

                    </div>

                    <form onSubmit={updateProfile} className="space-y-5">

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setname(e.target.value)}
                                required
                                minLength={2}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />

                        </div>

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />

                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer"
                        >
                            Update Profile
                        </button>

                    </form>

                </div>


                {/* Change Password */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">

                    <div className="mb-6">

                        <h2 className="text-xl font-bold text-gray-900">
                            Change Password
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Keep your account secure by updating your password.
                        </p>

                    </div>

                    <form onSubmit={changePassword} className="space-y-5">

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Current Password
                            </label>

                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setcurrentPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="Enter current password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />

                        </div>

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                New Password
                            </label>

                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setnewPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="Enter new password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />

                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer"
                        >
                            Change Password
                        </button>

                    </form>

                </div>


                {/* Delete Account */}

                <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6 md:p-8">

                    <h2 className="text-xl font-bold text-red-600">
                        Delete Account
                    </h2>

                    <p className="text-sm text-gray-600 mt-3 mb-5 leading-6">
                        Warning: This action cannot be undone. Your account,
                        posted jobs and related applications will be permanently deleted.
                    </p>

                    <button
                        onClick={deleteAccount}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer"
                    >
                        Delete My Account
                    </button>

                </div>

            </div>

        </div>
    )
}

export default Profile
