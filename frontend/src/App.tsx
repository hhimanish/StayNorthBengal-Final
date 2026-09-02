import Map from './components/Map';
import './App.css';

function App() {
  return (
    <div className="app-container" style={appContainerStyle}>
      <header className="app-header" style={headerStyle}>
        <h1 className="title" style={titleStyle}>StayNorthBengal – Explore the Terrain</h1>
      </header>
      <section className="map-section" style={sectionStyle}>
        <Map />
      </section>
    </div>
  );
}

const appContainerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
  color: '#fff',
  fontFamily: `'Inter', sans-serif`,
};

const headerStyle = {
  padding: '2rem',
  textAlign: 'center' as const,
  backdropFilter: 'blur(10px)',
  background: 'rgba(255,255,255,0.05)',
  borderRadius: '12px',
  marginBottom: '1rem',
};

const titleStyle = {
  fontSize: '2.5rem',
  margin: 0,
};

const sectionStyle = {
  width: '90%',
  maxWidth: '1200px',
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backdropFilter: 'blur(8px)',
  background: 'rgba(255,255,255,0.03)',
  borderRadius: '12px',
  padding: '1rem',
};

export default App;
