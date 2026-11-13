
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { API_URL } from "../api"

function Login() {
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")

    const navigate = useNavigate()

    async function handlelogin() {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })

            const data = await response.json()
            console.log(data)

            if (response.ok) {
                localStorage.setItem("token", data.access_token)

                alert("Login successful!")
                navigate("/jobs")
            } else {
                alert(data.detail)
            }

        } catch (error) {
            alert("Cannot connect to server")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">

            <section className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-100">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome Back
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Login to your account to continue.
                    </p>
                </div>

                <div className="space-y-5">

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>

                    <button
                        onClick={handlelogin}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md cursor-pointer"
                    >
                        Login
                    </button>

                </div>

                <div className="text-center mt-6 text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 font-semibold hover:text-blue-700"
                    >
                        Create Account
                    </Link>
                </div>

            </section>

        </div>
    )
}

export default Login
