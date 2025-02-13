import React,{useState} from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../style.css';

export default function Login(){
    const {setUser} = useUser();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({name:false, email:false});
    const navigate = useNavigate();

 
    function validateEmail (email) {
        return email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
    }
    
    const handleLogin = async() => {
        let newErrors = {
            name: name.trim('') === '',
            email: email.trim('') === '' || !validateEmail(email)
        }
        
        setErrors(newErrors)
        
        if( newErrors.name || newErrors.email){
            return;
        }
        try {
            const res = await axios.post('https://frontend-take-home-service.fetch.com/auth/login', 
                {name, email }, {withCredentials: true });
            if( res.status === 200){
                setUser(name); //CHANGE THIS
                navigate('/search');
            }
        } catch (error) {
            console.error('Login Failed: ', error);
            navigate('/search');
        }
        
    };

    return(
        <div className="main-container">
            <div className="login-container">
                <label className="form-label">Name</label>
                <input 
                    className={errors.name ? 'input-error' : ''}
                    style={{marginBottom: "40px"}}
                    type="text" 
                    name="name" 
                    placeholder="Enter your name" 
                    value={name} 
                    onChange={event => {setName(event.target.value); if(errors.name) setErrors({ ...errors, name: false })}} required/>
                <label className="form-label">Email</label>
                <input 
                    className={errors.email ? 'input-error' : ''} 
                    style={{marginBottom: "40px"}}
                    type="email" 
                    name="email" 
                    placeholder="Enter your email"
                    value={email} 
                    onChange={(event) => {setEmail(event.target.value); if(errors.email) setErrors({ ...errors, email: false })}} required/>
                <button onClick={handleLogin}> Login</button>
            </div>  
        </div>
        
    )
};