import React,{useState} from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../style.css';

export default function Login(){
    //User context and authentication and navigation through pages
    const {setUser} = useUser();
    const navigate = useNavigate();
    //States to login using name and email
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    //State for errors
    const [errors, setErrors] = useState({name:false, email:false});
    
    //Function to validate emails
    function validateEmail (email) {
        return email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
    }
    
    //Function to validate the name and email and login the user
    const handleLogin = async() => {
        //Setting errors if the name or email is missing or unvalid
        let newErrors = {
            name: name.trim('') === '',
            email: email.trim('') === '' || !validateEmail(email)
        };
        setErrors(newErrors)
        //Avoiding the API call if there is an error with name or email
        if( newErrors.name || newErrors.email){
            return;
        }
        try {
            const res = await axios.post('https://frontend-take-home-service.fetch.com/auth/login', 
                {name, email }, {withCredentials: true });
            if( res.status === 200){
                setUser(name); //Set the name of the user to be passed to search page
                navigate('/search'); //navigationg the user to search page
            }
        } catch (error) {
            console.error('Login Failed: ', error);
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