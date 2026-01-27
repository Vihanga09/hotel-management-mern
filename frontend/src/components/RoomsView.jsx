import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { styles } from '../styles/appStyles';
import { getRoomImage } from '../utils/imageUtils';

function RoomsView({ theme }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", date: "" });

  // Function to fetch all rooms from the backend
  const fetchRooms = () => {
    axios.get('http://localhost:5000/rooms').then(res => setRooms(res.data));
  };

  useEffect(() => { 
    fetchRooms();
  }, []);

  const handleBooking = (e) => {
    e.preventDefault();

    // 1. Get the currently logged-in user details from LocalStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // Check if user is logged in
    if (!user) {
      Swal.fire('Error', 'Please login to book a room!', 'error');
      return;
    }

    // 2. Prepare data for the backend, including the email for notification
    const bookingData = {
      roomId: selectedRoom._id,
      userId: user._id,      // Required for "My Bookings" history
      customerName: formData.name,
      email: user.email,     // <--- ESSENTIAL: Added email to trigger Nodemailer
      phoneNumber: formData.phone,
      checkInDate: formData.date
    };

    // 3. Send booking request to the backend
    axios.post('http://localhost:5000/bookings', bookingData)
      .then(() => {
        Swal.fire('Success', 'Room Booked Successfully! Confirmation email sent. ✅', 'success');
        setSelectedRoom(null);
        setFormData({ name: "", phone: "", date: "" });
        fetchRooms(); // Refresh list to show 'Sold Out' status
      })
      .catch(err => {
        console.error("Booking Error:", err);
        Swal.fire('Error', 'Booking failed!', 'error');
      });
  };

  return (
    <div style={styles.viewContainer}>
      <h2 style={{...styles.sectionTitle, color: theme.text}}>Our Premium Rooms</h2>
      <div style={styles.grid}>
        {rooms.map(room => (
          <div key={room._id} style={{
            ...styles.roomCard, 
            background: theme.card, 
            border: `1px solid ${theme.border}`,
            opacity: room.isAvailable ? 1 : 0.7 
          }}>
            <img src={getRoomImage(room.name)} style={styles.roomImg} alt={room.name} />
            <h2 style={{...styles.roomName, color: theme.text}}>{room.name}</h2>
            <div style={styles.roomDetails}><span style={styles.priceText}>LKR {room.price}</span></div>
            
            {room.isAvailable ? (
              <button onClick={() => setSelectedRoom(room)} style={styles.bookBtn}>
                Book Now
              </button>
            ) : (
              <button 
                style={{...styles.bookBtn, background: '#94a3b8', cursor: 'not-allowed'}} 
                disabled
              >
                Sold Out 🔒
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Booking Form Modal */}
      {selectedRoom && (
        <div style={styles.modalOverlay}>
          <div style={{...styles.formCard, background: theme.card, color: theme.text}}>
            <h3>Book {selectedRoom.name}</h3>
            <form onSubmit={handleBooking} style={styles.form}>
              <input 
                placeholder="Name" 
                value={formData.name}
                style={{...styles.input, background: theme.bg, color: theme.text, borderColor: theme.border}} 
                onChange={e=>setFormData({...formData, name: e.target.value})} 
                required 
              />
              <input 
                placeholder="Phone" 
                value={formData.phone}
                style={{...styles.input, background: theme.bg, color: theme.text, borderColor: theme.border}} 
                onChange={e=>setFormData({...formData, phone: e.target.value})} 
                required 
              />
              <input 
                type="date" 
                value={formData.date}
                style={{...styles.input, background: theme.bg, color: theme.text, borderColor: theme.border}} 
                onChange={e=>setFormData({...formData, date: e.target.value})} 
                required 
              />
              <div style={{display:'flex', gap:'10px'}}>
                <button type="submit" style={styles.confirmBtn}>Confirm</button>
                <button type="button" onClick={()=>setSelectedRoom(null)} style={styles.cancelBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomsView;