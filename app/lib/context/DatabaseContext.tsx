import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { initDatabase, seedDatabase, syncWithServer } from '../database';
import { isNetworkAvailable } from '../utils';

// Create context
interface DatabaseContextType {
  isLoading: boolean;
  isInitialized: boolean;
  syncData: () => Promise<void>;
  lastSyncTime: Date | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
  isLoading: true,
  isInitialized: false,
  syncData: async () => {},
  lastSyncTime: null
});

// Provider component
export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Initialize database
  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase();
        await seedDatabase();
        setIsInitialized(true);
        
        // Try to sync with server on startup
        await syncData();
      } catch (error) {
        console.error('Error initializing database:', error);
        Alert.alert(
          'Database Error',
          'There was an error initializing the database. Some features may not work properly.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // Set up periodic sync (every 5 minutes)
  useEffect(() => {
    if (!isInitialized) return;

    const syncInterval = setInterval(async () => {
      await syncData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(syncInterval);
  }, [isInitialized]);

  // Sync data with server
  const syncData = async () => {
    setIsLoading(true);
    try {
      if (await isNetworkAvailable()) {
        await syncWithServer();
        setLastSyncTime(new Date());
        Alert.alert('Sync Complete', 'Data has been synced with the server.');
      } else {
        Alert.alert('No Internet Connection', 'Please connect to the internet to sync data.');
      }
    } catch (error) {
      console.error('Error syncing data:', error);
      Alert.alert('Sync Failed', 'Failed to sync data with the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DatabaseContext.Provider value={{ isLoading, isInitialized, syncData, lastSyncTime }}>
      {children}
    </DatabaseContext.Provider>
  );
};

// Custom hook to use the database context
export const useDatabase = () => useContext(DatabaseContext);