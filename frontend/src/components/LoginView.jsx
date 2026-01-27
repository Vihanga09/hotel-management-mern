import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { styles } from '../styles/appStyles';

function LoginView({ theme }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password: pw });
      localStorage.setItem("user", JSON.stringify(res.data));
      
      if(res.data.isAdmin) {
        Swal.fire('Welcome Admin', 'Dashboard is ready', 'success').then(() => {
            window.location.href = '/admin';
        });
      } else {
        Swal.fire('Login Success', `Welcome back ${res.data.name}`, 'success').then(() => {
            window.location.href = '/';
        });
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data || 'Login Failed', 'error');
    }
  };

  return (
    <div style={styles.viewContainer}>
      <div style={{...styles.formCard, background: theme.card, margin:'100px auto', border: `1px solid ${theme.border}`}}>
        <h2 style={{color: theme.text, textAlign:'center', marginBottom:'20px'}}>Sign In</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            style={{...styles.input, background: theme.bg, color: theme.text, borderColor: theme.border}} 
            onChange={e=>setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={pw}
            style={{...styles.input, background: theme.bg, color: theme.text, borderColor: theme.border}} 
            onChange={e=>setPw(e.target.value)} 
            required 
          />
          <button type="submit" style={styles.confirmBtn}>Login</button>
          <p style={{textAlign:'center', color:theme.subText}}>Don't have an account? <Link to="/signup" style={{color:'#3b82f6'}}>Sign Up</Link></p>
        </form>
      </div>
    </div>
  );
}

export default LoginView;
