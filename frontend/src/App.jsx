import { useEffect, useState, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import axios from 'axios'

// Components
import Navbar from './components/Navbar'
import HomeView from './components/HomeView'
import RoomsView from './components/RoomsView'
import ReviewsView from './components/ReviewsView'
import ContactView from './components/ContactView'
import LoginView from './components/LoginView'
import SignupView from './components/SignupView'
import AdminDashboard from './components/AdminDashboard'
import AdminRoute from './components/AdminRoute'
import MyBookings from './components/MyBookings' 

// Utils and Styles
import { lightTheme, darkTheme } from './utils/themes'
import { styles } from './styles/appStyles'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [reviews, setReviews] = useState([]);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/reviews');
      setReviews(res.data);
    } catch (err) { console.error("Error fetching reviews:", err); }
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  return (
    <Router>
      <div style={{ ...styles.container, background: theme.bg, transition: '0.3s' }}>
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} theme={theme} />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<HomeView theme={theme} />} />
            <Route path="/rooms" element={<RoomsView theme={theme} />} />
            <Route path="/reviews" element={<ReviewsView theme={theme} reviews={reviews} fetchReviews={fetchReviews} />} />
            <Route path="/contact" element={<ContactView theme={theme} />} />
            <Route path="/login" element={<LoginView theme={theme} />} />
            <Route path="/signup" element={<SignupView theme={theme} />} />
            <Route path="/my-bookings" element={<MyBookings theme={theme} />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard theme={theme} reviews={reviews} fetchReviews={fetchReviews} /></AdminRoute>} />
          </Routes>
        </main>
        
        <footer style={{ ...styles.footer, background: isDarkMode ? '#000' : '#0f172a' }}>© 2026 Grand Horizon Hotel</footer>
      </div>
    </Router>
  );
}

export default App;