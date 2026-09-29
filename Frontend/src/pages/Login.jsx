import { useState } from "react"


function Login() {
    const [email,setemail] = useState("")
    const [password,setpassword] = useState("")
  return (
    <div>
       <section>
        <h1>
            Welcome Back
        </h1>
        <p>Login to your account to continue.</p>

            <label>Email :</label>
            <input type="text" placeholder="Enter your email"
            value={email}
            onChange={(e)=> setemail(e.target.value)} />

            <br />

            <label>Password :</label>
            <input type="password" placeholder="Enter your password" 
            value={password}
            onChange={(e)=> setpassword(e.target.value)} />
            <br />

            <button>Login</button>
       </section>
      
    </div>
  )
}

export default Login
