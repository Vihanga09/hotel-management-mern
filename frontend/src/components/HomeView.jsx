import { Link } from 'react-router-dom';
import { styles } from '../styles/appStyles';

function HomeView() {
  return (
    <div style={styles.heroWrapper}>
      <header style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Grand Horizon</h1>
          <div style={styles.heroDivider}></div>
          <p style={styles.heroSubtitle}>Where Luxury Meets the Horizon.</p>
          <Link to="/rooms" style={styles.primaryBtn}>Explore Rooms</Link>
        </div>
      </header>
    </div>
  );
}

export default HomeView;
