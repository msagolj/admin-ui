import React from 'react';
import Editor from '@monaco-editor/react';
import { Box, Typography } from '@mui/material';

interface JsonEditorProps {
  value: any;
  onChange: (value: any) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ 
  value, 
  onChange, 
  label,
  required,
  helperText 
}) => {
  const handleEditorChange = (value: string | undefined) => {
    if (!value) {
      onChange({});
      return;
    }
    try {
      const newValue = JSON.parse(value);
      onChange(newValue);
    } catch (err) {
      // If JSON is invalid, just pass the raw string
      onChange(value);
    }
  };

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" gutterBottom>
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </Typography>
      )}
      <Box sx={{ 
        border: '1px solid #ccc', 
        borderRadius: 1,
        overflow: 'hidden',
        height: '400px'
      }}>
        <Editor
          height="400px"
          defaultLanguage="json"
          value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            folding: true,
            formatOnPaste: true,
            formatOnType: true,
            automaticLayout: true,
          }}
          theme="vs-light"
        />
      </Box>
      {helperText && (
        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default JsonEditor; 