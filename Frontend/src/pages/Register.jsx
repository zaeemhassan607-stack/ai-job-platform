import { useState } from "react"
function Register() {
    const [name,setname] = useState("")
    const [email,setemail] = useState("")
    const [password,setpassword] = useState("")
  return (
    <div>
      <section>
            <h1>
            Create Your Account
            </h1>
        <p>Register to find jobs and manage your applications.</p>

            <label>Name :</label>
            <input type="text" placeholder="Enter your name"
            value={name}
            onChange={(e)=> setname(e.target.value)} />

            <br />

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

            <button>Register</button>
       </section>
    </div>
  )
}

export default Register
