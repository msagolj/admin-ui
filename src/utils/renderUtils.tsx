import React from 'react';
import { Link } from '@mui/material';

/**
 * Renders a value based on its type and key
 * @param key The key of the value (used for special cases like dates)
 * @param value The value to render
 * @returns React.ReactNode
 */
export const renderValue = (key: string, value: any): React.ReactNode|string|any => {
  // Handle sensitive token values
  key = key.toLowerCase();
  if (typeof value === 'string' && (key === 'x-auth-token' || key === 'x-content-source-authorization')) {
    if (value.length <= 8) return value;
    return `${value.substring(0, 8)}...${value.substring(value.length - 8)}`;
  }

  // Check if the value is a URL
  if (typeof value === 'string') {
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return (
        <Link href={value} target="_blank" rel="noopener noreferrer">
          {value}
        </Link>
      );
    }
    if (value.startsWith('markup:https://')) {
      const url = value.substring(7); // Remove 'markup:' prefix
      return (
        <Link href={url} target="_blank" rel="noopener noreferrer">
          {value}
        </Link>
      );
    }
  }

  // Check if the value is an array
  if (Array.isArray(value)) {
    // Only join if all elements are strings
    if (value.every(item => typeof item === 'string')) {
      return value.join(', ');
    }
  }

  // Handle nested objects
  if (typeof value === 'object' && value !== null) {  
    return (
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word',  backgroundColor: '#f5f5f5' }}>
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  // Check if the value is a date string
  if (typeof value === 'string' && (key.includes('date') || key.includes('modified'))) {
    return formatDate(value);
  }

  return value;
};  

export const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return 'N/A';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}; 


export const formatLabel = (key: string): string => {
  // Handle special cases for abbreviations
  const specialCases: Record<string, string> = {
    'id': 'ID',
    'url': 'URL',
    'api': 'API',
    'bus': 'Bus',
    'hlx': 'HLX',
    'cdn': 'CDN',
  };

  // Split by capital letters and special characters
  const words = key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/([0-9])/g, ' $1') // Add space before numbers
    .split(/[\s-_]+/) // Split by spaces, hyphens, and underscores
    .map(word => {
      // Handle special cases
      if (specialCases[word.toLowerCase()]) {
        return specialCases[word.toLowerCase()];
      }
      // Capitalize first letter of each word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ')
    .trim();

  return words;
};