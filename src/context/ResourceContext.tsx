import React, { createContext, useContext, useState, useEffect } from 'react';

interface ResourceContextType {
  owner: string;
  setOwner: (value: string) => void;
  repo: string;
  setRepo: (value: string) => void;
  ref: string;
  setRef: (value: string) => void;
  path: string;
  setPath: (value: string) => void;
  site: string;
  setSite: (value: string) => void;
  ownerHistory: string[];
  repoHistory: string[];
  refHistory: string[];
  pathHistory: string[];
  siteHistory: string[];
  updateHistory: () => void;
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

const MAX_HISTORY = 5;

const getStoredHistory = (key: string): string[] => {
  const stored = localStorage.getItem(`${key}_history`);
  return stored ? JSON.parse(stored) : [];
};

const updateStoredHistory = (key: string, value: string): string[] => {
  const history = getStoredHistory(key);
  const newHistory = [value, ...history.filter(item => item !== value)].slice(0, MAX_HISTORY);
  localStorage.setItem(`${key}_history`, JSON.stringify(newHistory));
  return newHistory;
};

export const ResourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage
  const [owner, setOwner] = useState(() => localStorage.getItem('resource_owner') || '');
  const [repo, setRepo] = useState(() => localStorage.getItem('resource_repo') || '');
  const [ref, setRef] = useState(() => localStorage.getItem('resource_ref') || '');
  const [path, setPath] = useState(() => localStorage.getItem('resource_path') || '');
  const [site, setSite] = useState(() => localStorage.getItem('resource_site') || '');

  // Initialize history from localStorage
  const [ownerHistory, setOwnerHistory] = useState(() => getStoredHistory('resource_owner'));
  const [repoHistory, setRepoHistory] = useState(() => getStoredHistory('resource_repo'));
  const [refHistory, setRefHistory] = useState(() => getStoredHistory('resource_ref'));
  const [pathHistory, setPathHistory] = useState(() => getStoredHistory('resource_path'));
  const [siteHistory, setSiteHistory] = useState(() => getStoredHistory('resource_site'));

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem('resource_owner', owner);
    localStorage.setItem('resource_repo', repo);
    localStorage.setItem('resource_ref', ref);
    localStorage.setItem('resource_path', path);
    localStorage.setItem('resource_site', site);
  }, [owner, repo, ref, path, site]);

  const updateHistory = () => {
    if (owner) {
      setOwnerHistory(updateStoredHistory('resource_owner', owner));
    }
    if (repo) {
      setRepoHistory(updateStoredHistory('resource_repo', repo));
    }
    if (ref) {
      setRefHistory(updateStoredHistory('resource_ref', ref));
    }
    if (path) {
      setPathHistory(updateStoredHistory('resource_path', path));
    }
    if (site) {
      setSiteHistory(updateStoredHistory('resource_site', site));
    }
  };

  return (
    <ResourceContext.Provider
      value={{
        owner,
        setOwner,
        repo,
        setRepo,
        ref,
        setRef,
        path,
        setPath,
        site,
        setSite,
        ownerHistory,
        repoHistory,
        refHistory,
        pathHistory,
        siteHistory,
        updateHistory,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};

export const useResource = () => {
  const context = useContext(ResourceContext);
  if (context === undefined) {
    throw new Error('useResource must be used within a ResourceProvider');
  }
  return context;
}; 