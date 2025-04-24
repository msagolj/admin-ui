import React, { useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface PathSelectorProps {
  paths: string[];
  onPathsChange: (paths: string[]) => void;
  title?: string;
  placeholder?: string;
  helperText?: string;
}

const PathSelector: React.FC<PathSelectorProps> = ({
  paths,
  onPathsChange,
  title = 'Paths',
  placeholder = 'Enter path (e.g., /en, /en/*, /blog/)',
  helperText = 'Use /* for recursive paths'
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleAddPath = () => {
    if (paths.length === 0 || paths[paths.length - 1].trim() !== '') {
      onPathsChange([...paths, '']);
      // Focus the new input field after it's added
      setTimeout(() => {
        const lastInput = inputRefs.current[paths.length];
        if (lastInput) lastInput.focus();
      }, 0);
    }
  };

  const handleRemovePath = (index: number) => {
    if (paths.length > 1) {
      onPathsChange(paths.filter((_, i) => i !== index));
    }
  };

  const handlePathChange = (index: number, value: string) => {
    const newPaths = [...paths];
    newPaths[index] = value;
    onPathsChange(newPaths);
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>{title}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {paths.map((path, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              value={path}
              onChange={(e) => handlePathChange(index, e.target.value)}
              placeholder={placeholder}
              helperText={helperText}
              required={index === 0}
              error={index === 0 && path.trim() === ''}
              inputRef={el => inputRefs.current[index] = el}
            />
            <IconButton 
              onClick={() => handleRemovePath(index)}
              disabled={paths.length === 1}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: -2 }}>
          <IconButton
            onClick={handleAddPath}
            color="primary"
            size="large"
            disabled={paths.length > 0 && paths[paths.length - 1].trim() === ''}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default PathSelector; 