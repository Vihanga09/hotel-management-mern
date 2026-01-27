import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { styles } from '../styles/appStyles';

function SignupView({ theme }) {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', data);
      Swal.fire('Success', 'Account created! Please login.', 'success');
      navigate('/login');
    } catch (err) {
      Swal.fire('Error', err.response?.data || 'Registration failed', 'error');
    }
  };

  return (
    <div style={styles.viewContainer}>
      <div style={{...styles.formCard, background: theme.card, margin:'100px auto', border: `1px solid ${theme.border}`}}>
        <h2 style={{color: theme.text, textAlign:'center', marginBottom:'20px'}}>Create Account</h2>
        <form onSubmit={handleSignup} style={styles.form}>
          <input 
            placeholder="Full Name" 
            style={{...styles.input, background: theme.bg, color: theme.text, borderColor: theme.border}} 
            onChange={e=>setData({...data, name: e.target.value})} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            style={{...styles.input, background: theme.bg, color: theme.text, borderColor: theme.border}} 
            onChange={e=>setData({...data, email: e.target.value})} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            style={{...styles.input, background: theme.bg, color: theme.text, borderColor: theme.border}} 
            onChange={e=>setData({...data, password: e.target.value})} 
            required 
          />
          <button type="submit" style={{...styles.confirmBtn, background: '#10b981'}}>Register</button>
          <p style={{textAlign:'center', color:theme.subText}}>Already have an account? <Link to="/login" style={{color:'#3b82f6'}}>Login</Link></p>
        </form>
      </div>
    </div>
  );
}

export default SignupView;
