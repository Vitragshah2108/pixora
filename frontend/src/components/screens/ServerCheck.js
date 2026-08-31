"use client";

import { api } from '@/lib/api';
import LoadingScreen from './LoadingScreen';

const ServerCheck = ({ children }) => {
  const [isServerRunning, setIsServerRunning] = useState(true); // Default to true to render app immediately
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await api.get('/', {
          timeout: 4000
        });
        if (response.data === "Server is running!") {
          setIsServerRunning(true);
        }
      } catch (error) {
        // In production/serverless, keep UI available
        setIsServerRunning(true);
      }
    };

    checkServer();
  }, [retryCount]);

  // Show loading while checking
  if (isServerRunning === null) {
    return <LoadingScreen />;
  }

  // Show server error if not running
  if (isServerRunning === false) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900/60 border border-red-500/20 rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Server Connection Failed</h2>
          <p className="text-gray-400 mb-4">
            Unable to connect to the backend server. Please make sure the server is running.
          </p>
          <button
            onClick={() => {
              setIsServerRunning(null);
              setRetryCount(0);
            }}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Server is running, render children
  return children;
};

export default ServerCheck;
