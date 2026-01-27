import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Updated import to fix "not a function" error
import { styles } from '../styles/appStyles';
import { getRoomImage } from '../utils/imageUtils';

function AdminDashboard({ theme, reviews, fetchReviews }) {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activeTab, setActiveTab] = useState("bookings");
  
  // State to store revenue and booking count statistics
  const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0 });

  const fetchAll = useCallback(() => {
    // Fetch all bookings and rooms
    axios.get('http://localhost:5000/bookings').then(res => setBookings(res.data));
    axios.get('http://localhost:5000/rooms').then(res => setRooms(res.data));
    
    // Fetch summary statistics for the revenue report
    axios.get('http://localhost:5000/bookings/stats/summary')
      .then(res => setStats(res.data))
      .catch(err => console.error("Error loading stats:", err));

    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Updated function to generate the PDF report using autoTable correctly
  const generateReport = () => {
    const doc = new jsPDF();
    
    // PDF Header Section
    doc.setFontSize(18);
    doc.text("Grand Horizon - Hotel Management Report", 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Total Bookings: ${stats.totalBookings}`, 14, 30);
    doc.text(`Total Revenue: LKR ${stats.totalRevenue.toLocaleString()}`, 14, 38);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 46);

    // Defining Table Columns
    const tableColumn = ["Customer Name", "Check-in Date", "Amount"];
    
    // Preparing Table Rows
    const tableRows = bookings.map(b => [
      b.customerName,
      new Date(b.checkInDate).toLocaleDateString(),
      `LKR ${b.roomId?.price || 0}`
    ]);

    // Calling autoTable as a function to avoid TypeError
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] } // Blue header matching the theme
    });

    // Save and download the PDF file
    doc.save(`Admin_Report_${new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <div style={styles.viewContainer}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', marginBottom:'30px'}}>
        <h1 style={{color: theme.text}}>Admin Panel</h1>
        
        {/* PDF Download Button */}
        <button 
          onClick={generateReport}
          style={{
            padding: '10px 20px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Download PDF Report 📄
        </button>
      </div>

      {/* Statistics Cards Section */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div style={{ 
            flex: 1, minWidth: '200px', background: theme.card, padding: '20px', 
            borderRadius: '15px', borderLeft: '5px solid #3b82f6', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
        }}>
          <h4 style={{ color: theme.subText, margin: 0 }}>Total Bookings</h4>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: theme.text, margin: '10px 0 0 0' }}>
            {stats.totalBookings}
          </p>
        </div>

        <div style={{ 
            flex: 1, minWidth: '200px', background: theme.card, padding: '20px', 
            borderRadius: '15px', borderLeft: '5px solid #10b981', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
        }}>
          <h4 style={{ color: theme.subText, margin: 0 }}>Total Revenue</h4>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981', margin: '10px 0 0 0' }}>
            LKR {stats.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      <div style={styles.tabBar}>
        <button onClick={()=>setActiveTab("bookings")} style={activeTab === "bookings" ? styles.activeTab : styles.inactiveTab}>Bookings</button>
        <button onClick={()=>setActiveTab("rooms")} style={activeTab === "rooms" ? styles.activeTab : styles.inactiveTab}>Rooms</button>
        <button onClick={()=>setActiveTab("reviews")} style={activeTab === "reviews" ? styles.activeTab : styles.inactiveTab}>Reviews</button>
      </div>

      {/* Tab Content */}
      {activeTab === "bookings" ? (
        <div style={{...styles.tableWrapper, background: theme.card}}>
          <table style={styles.modernTable}>
            <tbody>{bookings.map(b => (
              <tr key={b._id} style={{borderBottom:`1px solid ${theme.border}`}}>
                <td style={{...styles.td, color: theme.text}}><b>{b.customerName}</b></td>
                <td style={styles.td}>
                  <button onClick={()=>axios.delete(`http://localhost:5000/bookings/${b._id}`).then(fetchAll)} style={styles.redDeleteBtn}>Cancel</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : activeTab === "reviews" ? (
        <div style={{...styles.tableWrapper, background: theme.card}}>
          <table style={styles.modernTable}>
            <tbody>{reviews.map(r => (
              <tr key={r._id} style={{borderBottom:`1px solid ${theme.border}`}}>
                <td style={{...styles.td, color: theme.text}}><b>{r.name}</b>: {r.comment}</td>
                <td style={styles.td}>
                  <button onClick={()=>axios.delete(`http://localhost:5000/reviews/${r._id}`).then(fetchAll)} style={styles.redDeleteBtn}>Remove</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <div style={styles.grid}>{rooms.map(room => (
          <div key={room._id} style={{...styles.roomCard, background: theme.card}}>
            <img src={getRoomImage(room.name)} style={styles.roomImg} alt={room.name} />
            <h3 style={{color: theme.text, padding:'10px'}}>{room.name}</h3>
            <button onClick={()=>axios.delete(`http://localhost:5000/rooms/${room._id}`).then(fetchAll)} style={styles.redDeleteBtn}>🚫 Closed</button>
          </div>
        ))}</div>
      )}
    </div>
  );
}

export default AdminDashboard;