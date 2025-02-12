import { useEffect, useState } from "react";
import "../css/Login.scss"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Login() {
    const navigate = useNavigate()
    useEffect(()=>{
        if(sessionStorage.getItem('token')){
            navigate('/')
        }
    },[navigate])
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {login,loginLoading,loginError} = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Username:", username, "Password:", password);
        await login(username,password)
        navigate('/')
    };

    return (
        <div>
            <div className='img-background'>
                <div className='text'>
                    <h1>WELCOME</h1>
                    <h4>Enjoy your trip</h4>
                </div>
                <section className='container'>
                    <div className='container-login'>
                        <section className='part-input'>
                            <form onSubmit={handleSubmit}>
                                <h3>Login</h3>
                                <div className="row">
                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="  Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="row">
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="  Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    
                                >
                                    Login
                                </button>
                            </form>
                        </section>
                    </div>
                </section>
            </div>
        </div>
    )
}
