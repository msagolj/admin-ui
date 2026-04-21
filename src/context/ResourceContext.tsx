import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

interface ResourceContextType {
  owner: string;
  setOwner: (value: string) => void;
  site: string;
  setSite: (value: string) => void;
  ref: string;
  setRef: (value: string) => void;
  path: string;
  setPath: (value: string) => void;
  topic: string;
  setTopic: (value: string) => void;
  profile: string;
  setProfile: (value: string) => void;
  jobName: string;
  setJobName: (value: string) => void;
  apiKeyId: string;
  setApiKeyId: (value: string) => void;
  ownerHistory: string[];
  siteHistory: string[];
  refHistory: string[];
  pathHistory: string[];
  topicHistory: string[];
  profileHistory: string[];
  jobNameHistory: string[];
  updateHistory: () => void;
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

const MAX_HISTORY = 10;

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

// Migrate old 'resource_repo' data to 'resource_site' for users with existing localStorage
const migrateRepoToSite = () => {
  const oldValue = localStorage.getItem('resource_repo');
  const newValue = localStorage.getItem('resource_site');
  if (oldValue && !newValue) {
    localStorage.setItem('resource_site', oldValue);
  }
  const oldHistory = localStorage.getItem('resource_repo_history');
  const newHistory = localStorage.getItem('resource_site_history');
  if (oldHistory && !newHistory) {
    localStorage.setItem('resource_site_history', oldHistory);
  }
  localStorage.removeItem('resource_repo');
  localStorage.removeItem('resource_repo_history');
};

// Run migration once on load
migrateRepoToSite();

export const ResourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [owner, setOwner] = useState(() => localStorage.getItem('resource_owner') || '');
  const [site, setSite] = useState(() => localStorage.getItem('resource_site') || '');
  const [ref, setRef] = useState(() => localStorage.getItem('resource_ref') || '');
  const [path, setPath] = useState(() => localStorage.getItem('resource_path') || '');
  const [topic, setTopic] = useState(() => localStorage.getItem('resource_topic') || '');
  const [profile, setProfile] = useState(() => localStorage.getItem('resource_profile') || '');
  const [jobName, setJobName] = useState(() => localStorage.getItem('resource_jobName') || '');
  const [apiKeyId, setApiKeyId] = useState(() => localStorage.getItem('resource_apiKeyId') || '');

  const [ownerHistory, setOwnerHistory] = useState(() => getStoredHistory('resource_owner'));
  const [siteHistory, setSiteHistory] = useState(() => getStoredHistory('resource_site'));
  const [refHistory, setRefHistory] = useState(() => getStoredHistory('resource_ref'));
  const [pathHistory, setPathHistory] = useState(() => getStoredHistory('resource_path'));
  const [topicHistory, setTopicHistory] = useState(() => getStoredHistory('resource_topic'));
  const [profileHistory, setProfileHistory] = useState(() => getStoredHistory('resource_profile'));
  const [jobNameHistory, setJobNameHistory] = useState(() => getStoredHistory('resource_jobName'));

  useEffect(() => {
    localStorage.setItem('resource_owner', owner);
    localStorage.setItem('resource_site', site);
    localStorage.setItem('resource_ref', ref);
    localStorage.setItem('resource_path', path);
    localStorage.setItem('resource_topic', topic);
    localStorage.setItem('resource_profile', profile);
    localStorage.setItem('resource_jobName', jobName);
    localStorage.setItem('resource_apiKeyId', apiKeyId);
  }, [owner, site, ref, path, topic, profile, jobName, apiKeyId]);

  const updateHistory = useCallback(() => {
    if (owner) setOwnerHistory(updateStoredHistory('resource_owner', owner));
    if (site) setSiteHistory(updateStoredHistory('resource_site', site));
    if (ref) setRefHistory(updateStoredHistory('resource_ref', ref));
    if (path) setPathHistory(updateStoredHistory('resource_path', path));
    if (topic) setTopicHistory(updateStoredHistory('resource_topic', topic));
    if (profile) setProfileHistory(updateStoredHistory('resource_profile', profile));
    if (jobName) setJobNameHistory(updateStoredHistory('resource_jobName', jobName));
  }, [owner, site, ref, path, topic, profile, jobName]);

  const value = useMemo(() => ({
    owner, setOwner,
    site, setSite,
    ref, setRef,
    path, setPath,
    topic, setTopic,
    profile, setProfile,
    jobName, setJobName,
    apiKeyId, setApiKeyId,
    ownerHistory, siteHistory, refHistory, pathHistory,
    topicHistory, profileHistory, jobNameHistory,
    updateHistory,
  }), [
    owner, site, ref, path, topic, profile, jobName, apiKeyId,
    ownerHistory, siteHistory, refHistory, pathHistory,
    topicHistory, profileHistory, jobNameHistory,
    updateHistory,
  ]);

  return (
    <ResourceContext.Provider value={value}>
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
