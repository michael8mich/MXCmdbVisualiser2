import TopologyMap from './components/TopologyMap';
import ErrorBoundary from './components/ErrorBoundary';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <ThemeToggle />
        <ErrorBoundary>
          <TopologyMap />
        </ErrorBoundary>
      </div>
    </ThemeProvider>
  );
}

export default App;
