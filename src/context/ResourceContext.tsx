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
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export const ResourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage
  const [owner, setOwner] = useState(() => localStorage.getItem('resource_owner') || '');
  const [repo, setRepo] = useState(() => localStorage.getItem('resource_repo') || '');
  const [ref, setRef] = useState(() => localStorage.getItem('resource_ref') || '');
  const [path, setPath] = useState(() => localStorage.getItem('resource_path') || '');

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem('resource_owner', owner);
    localStorage.setItem('resource_repo', repo);
    localStorage.setItem('resource_ref', ref);
    localStorage.setItem('resource_path', path);
  }, [owner, repo, ref, path]);

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