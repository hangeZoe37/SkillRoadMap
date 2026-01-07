import axios from "axios";
const API_URL="http://localhost:6001/api/auth";

export function setAuthToken(token){
    if(token){
        localStorage.setItem('token',token);
    }
    else{
        localStorage.removeItem('token');
    }
}

// Check if token is expired
export function isTokenExpired(token) {
    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded.exp * 1000 < Date.now();
    } catch (error) {
        console.log(error);
        return true;
    }
}

// Get current token and validate it
export function getValidToken() {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
        logout();
        return null;
    }
    return token;
}


export async function signup(name,email,password){
    const res=await axios.post(`${API_URL}/signup`,{name,email,password});
    console.log(res.data);
    
    return res.data;
}

export async function login(email,password){
    const res=await axios.post(`${API_URL}/login`,{email,password});
    if(res.data.jwtToken){
        setAuthToken(res.data.jwtToken);
        localStorage.setItem("user",JSON.stringify({email:res.data.email,name:res.data.name}))
        
    }
    return res.data;
}

export function logout(){
    setAuthToken(null);
    localStorage.removeItem("user");

}

export function getCurrentUser(){
    return JSON.parse(localStorage.getItem("user"));
}

