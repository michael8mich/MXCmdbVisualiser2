import TopologyMap from './components/TopologyMap';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <TopologyMap />
      </ErrorBoundary>
    </div>
  );
}

export default App;
