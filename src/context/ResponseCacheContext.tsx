import React, { createContext, useContext, useRef, useCallback } from 'react';
import { RequestDetails } from '../types';

interface CacheEntry {
  status: number;
  responseData: any;
  requestDetails: RequestDetails | null;
}

interface ResponseCacheContextType {
  get: (key: string) => CacheEntry | undefined;
  set: (key: string, entry: CacheEntry) => void;
  remove: (key: string) => void;
}

const ResponseCacheContext = createContext<ResponseCacheContextType | undefined>(undefined);

export const ResponseCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());

  const get = useCallback((key: string) => cacheRef.current.get(key), []);
  const set = useCallback((key: string, entry: CacheEntry) => { cacheRef.current.set(key, entry); }, []);
  const remove = useCallback((key: string) => { cacheRef.current.delete(key); }, []);

  return (
    <ResponseCacheContext.Provider value={{ get, set, remove }}>
      {children}
    </ResponseCacheContext.Provider>
  );
};

export const useResponseCache = () => {
  const context = useContext(ResponseCacheContext);
  if (context === undefined) {
    throw new Error('useResponseCache must be used within a ResponseCacheProvider');
  }
  return context;
};
