import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import {
  BrainCircuit24Regular,
  PlugConnected24Regular,
  Server24Regular,
  Bot24Regular,
  Shield24Regular,
  Home24Regular,
  BrainCircuit24Filled,
  PlugConnected24Filled,
  Server24Filled,
  Bot24Filled,
  Shield24Filled,
  Home24Filled,
  Play24Regular,
  Play24Filled,
  DocumentBulletList24Regular,
  DocumentBulletList24Filled,
  Search24Regular,
  Search24Filled,
  Folder24Regular,
  Folder24Filled,
  DataUsage24Regular,
  DataUsage24Filled,
  People24Regular,
  People24Filled,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#1b1a19',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    flexShrink: 0,
  },
  logo: {
    padding: '16px 20px',
    borderBottom: '1px solid #333',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    color: '#60cdff',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
  },
  logoSubtext: {
    color: '#999',
    fontSize: '11px',
  },
  nav: {
    padding: '12px 0',
    flex: 1,
    overflowY: 'auto',
  },
  navSection: {
    padding: '4px 16px 8px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 20px',
    color: '#ccc',
    cursor: 'pointer',
    fontSize: '13px',
    textDecoration: 'none',
    transition: 'all 0.15s',
    borderLeft: '3px solid transparent',
    '&:hover': {
      backgroundColor: '#2d2c2b',
      color: '#fff',
    },
  },
  navItemActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 20px',
    color: '#60cdff',
    cursor: 'pointer',
    fontSize: '13px',
    textDecoration: 'none',
    backgroundColor: '#2d2c2b',
    borderLeft: '3px solid #60cdff',
    fontWeight: 600,
  },
  content: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: '12px 24px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  main: {
    padding: '24px',
  },
});

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactElement;
  activeIcon: React.ReactElement;
  section?: string;
}

const navItems: NavItem[] = [
  {
    path: '/',
    label: 'Dashboard',
    icon: <Home24Regular />,
    activeIcon: <Home24Filled />,
  },
  {
    path: '/playground',
    label: 'Playground',
    icon: <Play24Regular />,
    activeIcon: <Play24Filled />,
  },
  {
    path: '/catalog',
    label: 'Catalog',
    icon: <Search24Regular />,
    activeIcon: <Search24Filled />,
    section: 'Discovery',
  },
  {
    path: '/models',
    label: 'Models',
    icon: <BrainCircuit24Regular />,
    activeIcon: <BrainCircuit24Filled />,
    section: 'AI Assets',
  },
  {
    path: '/tools',
    label: 'Tools',
    icon: <PlugConnected24Regular />,
    activeIcon: <PlugConnected24Filled />,
  },
  {
    path: '/mcp-servers',
    label: 'MCP Servers',
    icon: <Server24Regular />,
    activeIcon: <Server24Filled />,
  },
  {
    path: '/agents',
    label: 'Agents',
    icon: <Bot24Regular />,
    activeIcon: <Bot24Filled />,
  },
  {
    path: '/namespaces',
    label: 'Namespaces',
    icon: <Folder24Regular />,
    activeIcon: <Folder24Filled />,
    section: 'Organization',
  },
  {
    path: '/consumers',
    label: 'Consumers',
    icon: <People24Regular />,
    activeIcon: <People24Filled />,
  },
  {
    path: '/policies',
    label: 'Policies',
    icon: <Shield24Regular />,
    activeIcon: <Shield24Filled />,
    section: 'Governance',
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: <DataUsage24Regular />,
    activeIcon: <DataUsage24Filled />,
    section: 'Observability',
  },
  {
    path: '/logs',
    label: 'Logs',
    icon: <DocumentBulletList24Regular />,
    activeIcon: <DocumentBulletList24Filled />,
    section: 'Observability',
  },
];

const Layout: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = (): string => {
    const item = navItems.find((n) => n.path === location.pathname);
    return item?.label || 'Dashboard';
  };

  let lastSection = '';

  return (
    <div className={styles.root}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>⚡</div>
          <div>
            <div className={styles.logoText}>AI Gateway</div>
            <div className={styles.logoSubtext}>Standalone</div>
          </div>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const showSection = item.section && item.section !== lastSection;
            if (item.section) lastSection = item.section;
            const isActive = location.pathname === item.path;

            return (
              <React.Fragment key={item.path}>
                {showSection && (
                  <div className={styles.navSection}>{item.section}</div>
                )}
                <div
                  className={isActive ? styles.navItemActive : styles.navItem}
                  onClick={() => navigate(item.path)}
                >
                  {isActive ? item.activeIcon : item.icon}
                  <span>{item.label}</span>
                </div>
              </React.Fragment>
            );
          })}
        </nav>
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Text size={500} weight="semibold">
              {getPageTitle()}
            </Text>
          </div>
          <Text size={200} style={{ color: '#666' }}>
            Contoso Corp · Production
          </Text>
        </div>
        <div className={styles.main}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
