import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { styles } from '../styles/appStyles';
import { getRoomImage } from '../utils/imageUtils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function MyBookings({ theme }) {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user && user._id) {
      axios.get(`http://localhost:5000/bookings/user/${user._id}`)
        .then(res => {
          setMyBookings(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error loading bookings:", err);
          setLoading(false);
        });
    }
  }, []);

  // Function to generate and download a professional PDF invoice
  const downloadInvoice = (booking) => {
    const doc = new jsPDF();

    // 1. Hotel Header Section
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80); // Dark Blue
    doc.text("GRAND HORIZON HOTEL", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("123 Luxury Road, Colombo, Sri Lanka", 14, 30);
    doc.text("Phone: +94 112 345 678 | Email: info@grandhorizon.com", 14, 35);
    
    // Draw a horizontal line as a separator
    doc.setDrawColor(200);
    doc.line(14, 40, 196, 40);

    // 2. Invoice Metadata
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("BOOKING INVOICE", 14, 50);

    doc.setFontSize(11);
    doc.text(`Invoice No: GH-${booking._id.substring(0, 8).toUpperCase()}`, 14, 60);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 67);
    doc.text(`Customer Name: ${booking.customerName}`, 14, 74);

    // 3. Booking Details Table
    autoTable(doc, {
      startY: 85,
      head: [['Description', 'Booking Details']],
      body: [
        ['Room Name', booking.roomId?.name || 'N/A'],
        ['Room Price', `LKR ${booking.roomId?.price?.toLocaleString() || '0'}`],
        ['Check-in Date', new Date(booking.checkInDate).toLocaleDateString()],
        ['Payment Status', 'Paid (Confirmed)'],
        ['Total Amount', `LKR ${booking.roomId?.price?.toLocaleString() || '0'}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [52, 152, 219] }, // Light blue matching a hotel theme
      columnStyles: { 0: { fontStyle: 'bold', width: 50 } }
    });

    // 4. Footer Section
    const finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.text("Thank you for your booking!", 14, finalY + 20);
    
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Please keep this invoice for your reference at the reception during check-in.", 14, finalY + 28);

    // 5. Download the PDF
    doc.save(`Invoice_${booking.customerName}_GH.pdf`);
  };

  const handleCancel = (bookingId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to cancel this booking?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5000/bookings/${bookingId}`)
          .then(() => {
            Swal.fire('Cancelled!', 'Your booking has been removed.', 'success');
            setMyBookings(myBookings.filter(b => b._id !== bookingId));
          })
          .catch(err => {
            Swal.fire('Error', 'Could not cancel booking', 'error');
            console.error(err);
          });
      }
    });
  };

  if (loading) return <div style={{textAlign:'center', marginTop:'50px', color: theme.text}}>Loading your bookings...</div>;

  return (
    <div style={styles.viewContainer}>
      <h2 style={{...styles.sectionTitle, color: theme.text, textAlign: 'center', marginBottom: '40px'}}>
        My Booking History
      </h2>
      
      <div style={styles.grid}>
        {myBookings.length > 0 ? (
          myBookings.map(b => (
            <div key={b._id} style={{
              ...styles.roomCard, 
              background: theme.card, 
              border: `1px solid ${theme.border}`,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {b.roomId && typeof b.roomId === 'object' ? (
                <>
                  <img 
                    src={getRoomImage(b.roomId.name)} 
                    style={styles.roomImg} 
                    alt={b.roomId.name} 
                  />
                  <div style={{padding: '20px'}}>
                    <h3 style={{...styles.roomName, color: theme.text, fontSize: '1.25rem'}}>
                      {b.roomId.name}
                    </h3>
                    <div style={{margin: '10px 0'}}>
                      <span style={{...styles.priceText, fontSize: '1.1rem'}}>
                        LKR {b.roomId.price?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{padding: '20px', textAlign: 'center', background: theme.bg, color: theme.subText}}>
                   <p>Room details loading...</p>
                </div>
              )}

              <div style={{padding: '0 20px 20px 20px'}}>
                <div style={{borderTop: `1px solid ${theme.border}`, paddingTop: '15px'}}>
                  <p style={{color: theme.subText, fontSize: '0.9rem'}}>
                    <b>Check-in Date:</b> {new Date(b.checkInDate).toLocaleDateString()}
                  </p>
                  <p style={{color: theme.subText, fontSize: '0.9rem', marginTop: '5px'}}>
                    <b>Customer:</b> {b.customerName}
                  </p>
                </div>

                <div style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'15px'}}>
                    <div style={{
                      background: '#dcfce7', color: '#166534', padding: '6px 15px', 
                      borderRadius: '20px', textAlign:'center',
                      fontSize: '0.8rem', fontWeight: 'bold'
                    }}>
                      Status: Confirmed ✅
                    </div>

                    {/* Download Invoice Button */}
                    <button 
                        onClick={() => downloadInvoice(b)}
                        style={{
                            padding: '8px',
                            background: '#e0f2fe',
                            color: '#0369a1',
                            border: '1px solid #bae6fd',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                        }}
                    >
                        Download Invoice 📄
                    </button>

                    {/* cancel button */}
                    <button 
                        onClick={() => handleCancel(b._id)}
                        style={{
                            padding: '8px',
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: '1px solid #fca5a5',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                        }}
                    >
                        Cancel Booking 🗑️
                    </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{textAlign: 'center', width: '100%', marginTop: '50px'}}>
             <p style={{color: theme.subText, fontSize: '1.1rem'}}>You haven't made any bookings yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;