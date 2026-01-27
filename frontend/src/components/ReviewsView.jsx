import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { styles } from '../styles/appStyles';

function ReviewsView({ theme, reviews, fetchReviews }) {
  const [rev, setRev] = useState({ name: "", comment: "" });
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.isAdmin === true;

  const addReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/reviews', { ...rev, color: "#3b82f6" });
      Swal.fire('Posted!', 'Review added.', 'success');
      setRev({ name: "", comment: "" });
      fetchReviews();
    } catch (err) { Swal.fire('Error', 'Failed to post.', 'error'); }
  };

  const deleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/reviews/${id}`);
      Swal.fire('Deleted!', 'Review removed.', 'success');
      fetchReviews();
    } catch (err) { Swal.fire('Error', 'Failed to delete.', 'error'); }
  };

  return (
    <div style={styles.viewContainer}>
      <h2 style={{...styles.sectionTitle, color: theme.text}}>Guest Stories</h2>
      
      {isAdmin ? (
        <div style={{background: 'linear-gradient(135deg, #3b82f6, #10b981)', padding: '30px', borderRadius: '30px', marginBottom: '40px', color: '#fff', textAlign:'center'}}>
          <h1 style={{margin:0}}>{reviews.length} Total Reviews</h1>
          <p style={{fontWeight:'bold'}}>Moderation Mode Active | You can remove any review below</p>
        </div>
      ) : (
        <div style={{...styles.reviewFormSection, background: theme.card, border: `1px solid ${theme.border}`}}>
          <form onSubmit={addReview} style={styles.formInline}>
            <input 
              placeholder="Your Name" 
              value={rev.name} 
              style={{...styles.input, background: theme.bg, color: theme.text, borderColor: theme.border}} 
              onChange={e=>setRev({...rev, name:e.target.value})} 
              required 
            />
            <textarea 
              placeholder="Experience" 
              value={rev.comment} 
              style={{...styles.input, background: theme.bg, color: theme.text, borderColor: theme.border, height:'80px'}} 
              onChange={e=>setRev({...rev, comment:e.target.value})} 
              required 
            />
            <button type="submit" style={styles.postBtn}>Post Review</button>
          </form>
        </div>
      )}

      <div style={styles.reviewsGridNew}>{reviews.map((r) => (
        <div key={r._id} style={{...styles.reviewCardNew, background: theme.card, color: theme.text, borderTop: `6px solid ${r.color || "#3b82f6"}`}}>
          <p style={{fontStyle:'italic'}}>"{r.comment}"</p>
          <h5>- {r.name}</h5>
          {isAdmin && (
            <button onClick={() => deleteReview(r._id)} style={{...styles.redDeleteBtn, width:'100%', marginTop:'10px'}}>🗑️ Delete Review</button>
          )}
        </div>
      ))}</div>
    </div>
  );
}

export default ReviewsView;
