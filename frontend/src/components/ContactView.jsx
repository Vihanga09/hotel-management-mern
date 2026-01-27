import { styles } from '../styles/appStyles';

function ContactView({ theme }) {
  return (
    <div style={styles.viewContainer}>
      <h2 style={{...styles.sectionTitle, color: theme.text}}>Contact Us</h2>
      <div style={styles.contactGridNew}>
        <div style={{...styles.contactCardNew, background: 'linear-gradient(135deg, #667eea, #764ba2)', color:'#fff'}}>
          📍
          <h4>Location</h4>
          <p>Colombo, Sri Lanka</p>
        </div>
        <div style={{...styles.contactCardNew, background: 'linear-gradient(135deg, #f093fb, #f5576c)', color:'#fff'}}>
          📞
          <h4>Hotline</h4>
          <p>+94 112 345 678</p>
        </div>
      </div>
    </div>
  );
}

export default ContactView;
