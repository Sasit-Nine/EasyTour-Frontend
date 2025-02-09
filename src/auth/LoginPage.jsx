import { useState } from "react";
import "../css/Login.scss"

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Username:", username, "Password:", password);
        alert(`Username: ${username}\nPassword: ${password}`);
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
