import { useNavigate, Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { styles } from '../styles/appStyles';

function Navbar({ isDarkMode, setIsDarkMode, theme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdminLoggedIn = user?.isAdmin === true;

  const getLinkStyle = (path) => ({
    ...styles.navItemBtn,
    color: location.pathname === path ? '#3b82f6' : theme.text,
    borderBottom: location.pathname === path ? '2px solid #3b82f6' : 'none'
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    Swal.fire('Logged Out', 'Successfully logged out!', 'info').then(() => {
        window.location.href = '/login';
    });
  };

  return (
    <nav style={{ ...styles.navbar, background: theme.card, borderColor: theme.border }}>
      <div onClick={() => navigate('/')} style={styles.navBrand}>🏨 GRAND HORIZON</div>
      <div style={styles.navLinks}>
        <Link to="/" style={getLinkStyle('/')}>Home</Link>
        <Link to="/rooms" style={getLinkStyle('/rooms')}>Rooms</Link>
        
        {/*user new */}
        {user && !isAdminLoggedIn && (
          <Link to="/my-bookings" style={getLinkStyle('/my-bookings')}>My Bookings</Link>
        )}

        <Link to="/reviews" style={getLinkStyle('/reviews')}>Reviews</Link>
        <Link to="/contact" style={getLinkStyle('/contact')}>Contact</Link>
        
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={styles.themeToggleBtn}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        
        {isAdminLoggedIn && (
          <button onClick={() => navigate('/admin')} style={styles.adminToggle}>Dashboard</button>
        )}

        {user ? (
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        ) : (
          <div style={{display:'flex', gap:'10px'}}>
            <button onClick={() => navigate('/login')} style={styles.adminToggle}>Login</button>
            <button onClick={() => navigate('/signup')} style={{...styles.adminToggle, background:'#10b981'}}>Sign Up</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;