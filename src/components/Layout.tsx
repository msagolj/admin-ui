import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar,
  Toolbar,
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItemButton,
  ListItem, 
  ListItemIcon, 
  ListItemText,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Chip,
  Button,
  Menu,
  MenuItem,
  CircularProgress
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import PreviewIcon from '@mui/icons-material/Preview';
import CodeIcon from '@mui/icons-material/Code';
import CachedIcon from '@mui/icons-material/Cached';
import SearchIcon from '@mui/icons-material/Search';
import MapIcon from '@mui/icons-material/Map';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LoginIcon from '@mui/icons-material/Login';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import WebIcon from '@mui/icons-material/Web';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GetAppIcon from '@mui/icons-material/GetApp';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TokenInputModal from './TokenInputModal';

const drawerWidth = 280;

const existingRoutes = [
  '/status/general',
  '/status/bulk',
  '/preview/status',
  '/preview/update',
  '/preview/delete',
  '/preview/bulk',
  '/publish/status',
  '/publish/resource',
  '/publish/unpublish',
  '/publish/bulk',
  '/code/status',
  '/code/update',
  '/code/delete',
  '/cache/purge',
  '/index/status',
  '/index/reindex',
  '/index/remove',
  '/org-config/read',
  '/org-config/users',
  '/site-config/list',
  '/site-config/read',
  '/site-config/update',
  '/site-config/delete',
  '/jobs/list',
  '/jobs/status',
  '/jobs/details',
  '/jobs/stop'
];

interface SubMenuItem {
  text: string;
  path: string;
  method: string;
}

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path?: string;
  method?: string;
  subItems?: SubMenuItem[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

interface LayoutProps {
  children: React.ReactNode;
}

const menuGroups: MenuGroup[] = [
  {
    title: 'Authoring and Publishing',
    items: [
      {
        text: 'Status',
        icon: <CheckCircleIcon />,
        subItems: [
          { text: 'General Status', path: '/status/general', method: 'GET' },
          { text: 'Bulk Status Job', path: '/status/bulk', method: 'POST' }
        ]
      },
      {
        text: 'Preview',
        icon: <PreviewIcon />,
        subItems: [
          { text: 'Preview Status', path: '/preview/status', method: 'GET' },
          { text: 'Update Preview', path: '/preview/update', method: 'POST' },
          { text: 'Delete Preview', path: '/preview/delete', method: 'DELETE' },
          { text: 'Bulk Preview Job', path: '/preview/bulk', method: 'POST' }
        ]
      },
      {
        text: 'Publish',
        icon: <CloudUploadIcon />,
        subItems: [
          { text: 'Publish Status', path: '/publish/status', method: 'GET' },
          { text: 'Publish Resource', path: '/publish/resource', method: 'POST' },
          { text: 'Un-publish Resource', path: '/publish/unpublish', method: 'DELETE' },
          { text: 'Bulk Publish Job', path: '/publish/bulk', method: 'POST' }
        ]
      },
      {
        text: 'Code',
        icon: <CodeIcon />,
        subItems: [
          { text: 'Code Status', path: '/code/status', method: 'GET' },
          { text: 'Update Code', path: '/code/update', method: 'POST' },
          { text: 'Delete Code', path: '/code/delete', method: 'DELETE' },
          { text: 'Batch Update Code', path: '/code/batch', method: 'POST' }
        ]
      },
      {
        text: 'Cache',
        icon: <CachedIcon />,
        subItems: [
          { text: 'Purge Live Cache', path: '/cache/purge', method: 'POST' }
        ]
      },
      {
        text: 'Index',
        icon: <SearchIcon />,
        subItems: [
          { text: 'Index Status', path: '/index/status', method: 'GET' },
          { text: 'Re-index Resource', path: '/index/reindex', method: 'POST' },
          { text: 'Remove from Index', path: '/index/remove', method: 'DELETE' }
        ]
      },
      {
        text: 'Sitemap',
        icon: <MapIcon />,
        subItems: [
          { text: 'Generate Sitemap', path: '/sitemap/generate', method: 'POST' }
        ]
      },
      {
        text: 'Snapshot',
        icon: <CameraAltIcon />,
        subItems: [
          { text: 'List Snapshots', path: '/snapshot/list', method: 'GET' },
          { text: 'Snapshot Manifest', path: '/snapshot/manifest', method: 'GET' },
          { text: 'Update Manifest', path: '/snapshot/manifest/update', method: 'POST' },
          { text: 'Snapshot Status', path: '/snapshot/status', method: 'GET' },
          { text: 'Add Resource', path: '/snapshot/add', method: 'POST' },
          { text: 'Delete Snapshot', path: '/snapshot/delete', method: 'DELETE' },
          { text: 'Bulk Snapshot Job', path: '/snapshot/bulk', method: 'POST' },
          { text: 'Publish Resource', path: '/snapshot/publish/resource', method: 'POST' },
          { text: 'Publish Snapshot', path: '/snapshot/publish', method: 'POST' },
          { text: 'Change Review State', path: '/snapshot/review', method: 'POST' }
        ]
      },
    ]
  },
  {
    title: 'Operations',
    items: [
      {
        text: 'Authentication',
        icon: <LoginIcon />,
        subItems: [
          { text: 'Login Selection', path: '/auth/login', method: 'GET' },
          { text: 'Auto Login', path: '/auth/auto', method: 'GET' },
          { text: 'Logout', path: '/auth/logout', method: 'GET' },
          { text: 'Profile Information', path: '/auth/profile', method: 'GET' }
        ]
      },
      {
        text: 'Logs',
        icon: <DescriptionIcon />,
        subItems: [
          { text: 'Get Logs', path: '/logs/get', method: 'GET' },
          { text: 'Add Logs', path: '/logs/add', method: 'POST' }
        ]
      },
      {
        text: 'Jobs',
        icon: <WorkIcon />,
        subItems: [
          { text: 'Job List', path: '/jobs/list', method: 'GET' },
          { text: 'Job Status', path: '/jobs/status', method: 'GET' },
          { text: 'Stop Job', path: '/jobs/stop', method: 'DELETE' },
          { text: 'Job Details', path: '/jobs/details', method: 'GET' }
        ]
      },
    ]
  },
  {
    title: 'Configuration Management',
    items: [
      {
        text: 'Org Config',
        icon: <BusinessIcon />,
        subItems: [
          { text: 'Read Org Config', path: '/org-config/read', method: 'GET' },
          { text: 'List Users', path: '/org-config/users', method: 'GET' },
          { text: 'Update Org Config', path: '/org-config/update', method: 'POST' },
          { text: 'Create Org Config', path: '/org-config/create', method: 'PUT' },
          { text: 'Delete Org Config', path: '/org-config/delete', method: 'DELETE' },
          { text: 'Create User', path: '/org-config/users/create', method: 'POST' },
          { text: 'Read User', path: '/org-config/users/read', method: 'GET' },
          { text: 'Delete User', path: '/org-config/users/delete', method: 'DELETE' },
          { text: 'List Secrets', path: '/org-config/secrets/list', method: 'GET' },
          { text: 'Create Secret', path: '/org-config/secrets/create', method: 'POST' },
          { text: 'Read Secret', path: '/org-config/secrets/read', method: 'GET' },
          { text: 'Delete Secret', path: '/org-config/secrets/delete', method: 'DELETE' }
        ]
      },
      {
        text: 'Site Config',
        icon: <WebIcon />,
        subItems: [
          { text: 'List Sites', path: '/site-config/list', method: 'GET' },
          { text: 'Read Site Config', path: '/site-config/read', method: 'GET' },
          { text: 'Update Site Config', path: '/site-config/update', method: 'POST' },
          { text: 'Create Site Config', path: '/site-config/create', method: 'PUT' },
          { text: 'Delete Site Config', path: '/site-config/delete', method: 'DELETE' },
          { text: 'Read Robots.txt', path: '/site-config/robots/read', method: 'GET' },
          { text: 'Update Robots.txt', path: '/site-config/robots/update', method: 'POST' },
          { text: 'List Access Tokens', path: '/site-config/tokens/list', method: 'GET' },
          { text: 'Create Token', path: '/site-config/tokens/create', method: 'POST' },
          { text: 'Read Token', path: '/site-config/tokens/read', method: 'GET' },
          { text: 'Delete Token', path: '/site-config/tokens/delete', method: 'DELETE' },
          { text: 'List Secrets', path: '/site-config/secrets/list', method: 'GET' }
        ]
      },
    ]
  }
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Authoring and Publishing']);
  const [expandedSubMenus, setExpandedSubMenus] = useState<string[]>([]);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { handleTokenSubmit: submitToken } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAccordionChange = (groupTitle: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedGroups(prev => 
      isExpanded 
        ? [...prev, groupTitle]
        : prev.filter(title => title !== groupTitle)
    );
  };

  const handleSubMenuToggle = (menuTitle: string) => {
    setExpandedSubMenus(prev =>
      prev.includes(menuTitle)
        ? prev.filter(title => title !== menuTitle)
        : [...prev, menuTitle]
    );
  };

  const handleSettingsClick = () => {
    setShowTokenModal(true);
  };

  const handleTokenModalClose = () => {
    setShowTokenModal(false);
  };

  const handleTokenSubmit = (token: string, aemToken: string) => {
    submitToken(token, aemToken);
    handleTokenModalClose();
  };

  const isActivePath = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const isRouteExists = (path?: string) => {
    if (!path) return false;
    return existingRoutes.includes(path);
  };

  const drawer = (
    <div>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      {menuGroups.map((group) => (
        <Accordion
          key={group.title}
          expanded={expandedGroups.includes(group.title)}
          onChange={handleAccordionChange(group.title)}
          sx={{
            '&:before': {
              display: 'none',
            },
            boxShadow: 'none',
            backgroundColor: 'transparent',
            '&.Mui-expanded': {
              margin: '0',
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              minHeight: '48px',
              '& .MuiAccordionSummary-content': {
                margin: '0',
                padding: '0',
              },
              '&.Mui-expanded': {
                minHeight: '48px',
              },
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', pl: 2 }}>
              {group.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, pt: 0.1 }}>
            <List sx={{ py: 0 }}>
              {group.items.map((item) => (
                <React.Fragment key={item.text}>
                  {item.subItems ? (
                    <>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => handleSubMenuToggle(item.text)}
                          sx={{
                            px: 0,
                            '& .MuiListItemIcon-root': {
                              minWidth: '40px',
                              ml: 4,
                            },
                            '& .MuiListItemText-root': {
                              mr: 0,
                              pr: 0.5,
                            },
                            '& .MuiSvgIcon-root': {
                              mr: 2,
                            },
                          }}
                        >
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.text} />
                          <ExpandMoreIcon
                            sx={{
                              transform: expandedSubMenus.includes(item.text) ? 'rotate(180deg)' : 'none',
                              transition: 'transform 0.2s',
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                      {expandedSubMenus.includes(item.text) && (
                        <List sx={{ pl: 4 }}>
                          {item.subItems.map((subItem) => (
                            <ListItem key={subItem.text} disablePadding>
                              <ListItemButton
                                onClick={() => {
                                  if (subItem.path && isRouteExists(subItem.path)) {
                                    navigate(subItem.path);
                                  }
                                  if (isMobile) {
                                    setMobileOpen(false);
                                  }
                                }}
                                disabled={!isRouteExists(subItem.path)}
                                sx={{
                                  px: 0,
                                  pl: 2,
                                  backgroundColor: isActivePath(subItem.path) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                                  '&:hover': {
                                    backgroundColor: isActivePath(subItem.path) 
                                      ? 'rgba(25, 118, 210, 0.12)' 
                                      : 'rgba(0, 0, 0, 0.04)',
                                  },
                                  '&.Mui-disabled': {
                                    opacity: 0.5,
                                  },
                                }}
                              >
                                <Tooltip title={subItem.method}>
                                  <Chip
                                    label={subItem.method === 'DELETE' ? 'DEL' : subItem.method}
                                    size="small"
                                    sx={{
                                      mr: 1,
                                      height: '18px',
                                      width: '48px',
                                      borderRadius: '4px',
                                      '& .MuiChip-label': {
                                        px: 1,
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        color: 'white',
                                        width: '100%',
                                        textAlign: 'center'
                                      },
                                      backgroundColor: subItem.method === 'GET' ? 'success.main' :
                                        subItem.method === 'POST' ? 'primary.main' :
                                        subItem.method === 'DELETE' ? 'error.main' :
                                        'warning.main',
                                      opacity: isRouteExists(subItem.path) ? 1 : 0.5,
                                    }}
                                  />
                                </Tooltip>
                                <ListItemText 
                                  primary={subItem.text}
                                  sx={{
                                    color: isActivePath(subItem.path) ? 'primary.main' : 'inherit',
                                    fontWeight: isActivePath(subItem.path) ? 600 : 400,
                                    opacity: isRouteExists(subItem.path) ? 1 : 0.5,
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </>
                  ) : (
                    <ListItem key={item.text} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          if (item.path && isRouteExists(item.path)) {
                            navigate(item.path);
                          }
                          if (isMobile) {
                            setMobileOpen(false);
                          }
                        }}
                        disabled={!isRouteExists(item.path)}
                        sx={{
                          px: 0,
                          '& .MuiListItemIcon-root': {
                            minWidth: '40px',
                            ml: 4,
                          },
                          '& .MuiListItemText-root': {
                            mr: 0,
                            pr: 0.5,
                          },
                          backgroundColor: item.path ? (isActivePath(item.path) ? 'rgba(25, 118, 210, 0.08)' : 'transparent') : 'transparent',
                          '&:hover': {
                            backgroundColor: item.path 
                              ? (isActivePath(item.path) ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)')
                              : 'rgba(0, 0, 0, 0.04)',
                          },
                          '&.Mui-disabled': {
                            opacity: 0.5,
                          },
                        }}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText 
                          primary={item.text}
                          sx={{
                            color: item.path ? (isActivePath(item.path) ? 'primary.main' : 'inherit') : 'inherit',
                            fontWeight: item.path ? (isActivePath(item.path) ? 600 : 400) : 400,
                            opacity: isRouteExists(item.path) ? 1 : 0.5,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  )}
                </React.Fragment>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      '& ::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '& ::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '& ::-webkit-scrollbar-thumb': {
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '4px',
        '&:hover': {
          background: 'rgba(0, 0, 0, 0.3)',
        },
      },
      '& ::-webkit-scrollbar-corner': {
        background: 'transparent',
      },
    }}>
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            AEM Admin API Dashboard
          </Typography>
          <Button
            color="inherit"
            startIcon={<SettingsIcon />}
            onClick={handleSettingsClick}
            sx={{ ml: 2 }}
          >
            Settings
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ 
          width: { md: drawerWidth }, 
          flexShrink: { md: 0 },
          '& .MuiDrawer-paper': {
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '4px',
              '&:hover': {
                background: 'rgba(0, 0, 0, 0.3)',
              },
            },
          },
        }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px'
        }}
      >
        {children}
      </Box>
      <TokenInputModal
        open={showTokenModal}
        onClose={handleTokenModalClose}
        onSubmit={handleTokenSubmit}
      />
    </Box>
  );
};

export default Layout; 