import React, { useState, useEffect, useRef, forwardRef } from 'react';
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

interface JsonEditorRef {
  getLatestValue: () => any;
}

const JsonEditor = forwardRef<JsonEditorRef, JsonEditorProps>(({ 
  value, 
  onChange, 
  label,
  required,
  helperText 
}, ref) => {
  const [internalValue, setInternalValue] = useState<string>('');
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setInternalValue(typeof value === 'string' ? value : JSON.stringify(value, null, 2));
  }, [value]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.onDidBlurEditorWidget(() => {
      const currentValue = editor.getValue();
      try {
        const parsedValue = JSON.parse(currentValue);
        onChange(parsedValue);
      } catch (err) {
        // If JSON is invalid, just pass the raw string
        onChange(currentValue);
      }
    });
  };

  // Method to get the latest value from the editor
  const getLatestValue = () => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      try {
        return JSON.parse(currentValue);
      } catch (err) {
        return currentValue;
      }
    }
    return value;
  };

  // Expose the getLatestValue method to parent components
  React.useImperativeHandle(ref, () => ({
    getLatestValue
  }));

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
          value={internalValue}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            folding: true,
            formatOnPaste: true,
            formatOnType: true,
            automaticLayout: true
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
});

export default JsonEditor; 