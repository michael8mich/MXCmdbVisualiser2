import TopologyMap from './components/TopologyMap';
import ErrorBoundary from './components/ErrorBoundary';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { IconProvider } from './context/IconContext';

function App() {
  return (
    <ThemeProvider>
      <IconProvider>
        <div className="App">
          <ThemeToggle />
          <ErrorBoundary>
            <TopologyMap />
          </ErrorBoundary>
        </div>
      </IconProvider>
    </ThemeProvider>
  );
}

export default App;
