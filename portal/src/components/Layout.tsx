import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import {
  BrainCircuit24Regular,
  PlugConnected24Regular,
  Bot24Regular,
  Shield24Regular,
  Home24Regular,
  BrainCircuit24Filled,
  PlugConnected24Filled,
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
  DocumentText24Regular,
  QuestionCircle24Regular,
  Alert24Regular,
  CommentMultiple24Regular,
  SignOut24Regular,
  ChevronDown24Regular,
  Settings24Regular,
  Lightbulb24Regular,
  Lightbulb24Filled,
  Flow24Regular,
  Flow24Filled,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
  topBar: {
    height: '40px',
    backgroundColor: '#1b1a19',
    borderBottom: '1px solid #333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    flexShrink: 0,
    zIndex: 100,
  },
  topBarBrand: {
    color: '#999',
    fontSize: '13px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    position: 'relative',
  },
  topBarIconBtn: {
    color: '#999',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    '&:hover': {
      color: '#fff',
      backgroundColor: '#2d2c2b',
    },
  },
  notifBadge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    backgroundColor: '#d13438',
    color: '#fff',
    fontSize: '10px',
    fontWeight: 700,
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 8px',
    color: '#ccc',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    fontFamily: 'inherit',
    '&:hover': {
      backgroundColor: '#2d2c2b',
      color: '#fff',
    },
  },
  profileAvatar: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: '#0078d4',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  profileName: {
    fontSize: '13px',
    whiteSpace: 'nowrap',
  },
  profileDropdown: {
    position: 'absolute',
    top: '36px',
    right: '0',
    backgroundColor: '#252423',
    border: '1px solid #444',
    borderRadius: '6px',
    padding: '12px 0',
    minWidth: '220px',
    zIndex: 1000,
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  },
  profileDropdownInfo: {
    padding: '4px 16px 12px',
  },
  profileDropdownName: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
  },
  profileDropdownEmail: {
    color: '#999',
    fontSize: '12px',
  },
  profileDropdownOrg: {
    color: '#888',
    fontSize: '11px',
    marginTop: '2px',
  },
  profileDropdownDivider: {
    height: '1px',
    backgroundColor: '#444',
    margin: '4px 0',
  },
  profileDropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    color: '#ccc',
    fontSize: '13px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'inherit',
    '&:hover': {
      backgroundColor: '#2d2c2b',
      color: '#fff',
    },
  },
  bodyRow: {
    display: 'flex',
    flex: 1,
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
    padding: '10px 20px',
    borderBottom: '1px solid #333',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: {
    color: '#60cdff',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    color: '#ccc',
    fontSize: '13px',
    fontWeight: 600,
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
  navItemNested: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 20px 6px 36px',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '12px',
    textDecoration: 'none',
    transition: 'all 0.15s',
    borderLeft: '3px solid transparent',
    '&:hover': {
      backgroundColor: '#2d2c2b',
      color: '#ccc',
    },
  },
  navItemNestedActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 20px 6px 36px',
    color: '#60cdff',
    cursor: 'pointer',
    fontSize: '12px',
    textDecoration: 'none',
    backgroundColor: '#2d2c2b',
    borderLeft: '3px solid #60cdff',
    fontWeight: 600,
  },
  content: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: '#141414',
  },
  header: {
    backgroundColor: '#1e1e1e',
    padding: '10px 20px',
    borderBottom: '1px solid #333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  envIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#aaa',
  },
  envDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#0e9349',
  },
  main: {
    padding: '16px 20px',
  },
  sidebarFooter: {
    borderTop: '1px solid #333',
    padding: '8px 0',
    flexShrink: 0,
  },
  sidebarFooterItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '7px 20px',
    color: '#888',
    cursor: 'pointer',
    fontSize: '12px',
    textDecoration: 'none',
    transition: 'all 0.15s',
    backgroundColor: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'inherit',
    '&:hover': {
      backgroundColor: '#2d2c2b',
      color: '#ccc',
    },
  },
});

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactElement;
  activeIcon: React.ReactElement;
  section?: string;
  nested?: boolean;
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
    label: 'Browse',
    icon: <Search24Regular />,
    activeIcon: <Search24Filled />,
    section: 'AI Assets',
  },
  {
    path: '/models',
    label: 'Models',
    icon: <BrainCircuit24Regular />,
    activeIcon: <BrainCircuit24Filled />,
    nested: true,
  },
  {
    path: '/tools',
    label: 'Tools',
    icon: <PlugConnected24Regular />,
    activeIcon: <PlugConnected24Filled />,
    nested: true,
  },
  {
    path: '/agents',
    label: 'Agents',
    icon: <Bot24Regular />,
    activeIcon: <Bot24Filled />,
    nested: true,
  },
  {
    path: '/skills',
    label: 'Skills',
    icon: <Lightbulb24Regular />,
    activeIcon: <Lightbulb24Filled />,
    nested: true,
  },
  {
    path: '/workflows',
    label: 'Workflows',
    icon: <Flow24Regular />,
    activeIcon: <Flow24Filled />,
    nested: true,
  },
  {
    path: '/namespaces',
    label: 'Namespaces',
    icon: <Folder24Regular />,
    activeIcon: <Folder24Filled />,
    section: 'Governance',
  },
  {
    path: '/access',
    label: 'Access',
    icon: <People24Regular />,
    activeIcon: <People24Filled />,
  },
  {
    path: '/policies',
    label: 'Policies',
    icon: <Shield24Regular />,
    activeIcon: <Shield24Filled />,
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

interface LayoutProps {
  onSignOut?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ onSignOut }) => {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = (): string => {
    const item = navItems.find((n) => n.path === location.pathname);
    return item?.label || 'Dashboard';
  };

  const pageSubtitles: Record<string, string> = {
    '/': 'Overview of your AI gateway — quick actions, usage stats, and recent activity',
    '/playground': 'Compose and test AI experiences end-to-end through the gateway',
    '/catalog': 'Discover and explore AI assets across your organization',
    '/models': 'Register, route, and monitor AI models from any provider',
    '/tools': 'APIs, MCP servers, connectors, and triggers available through the gateway',
    '/agents': 'Manage agents that orchestrate models and tools to complete tasks',
    '/skills': 'Reusable AI automation patterns — prompt chains, analysis, and automations',
    '/workflows': 'Multi-step orchestration patterns combining models, tools, and logic',
    '/namespaces': 'Organize assets into team and project boundaries',
    '/access': 'Manage who can access the gateway and its assets',
    '/policies': 'Runtime policies, asset access rules, and safety guardrails',
    '/analytics': 'Token usage, cost, and performance metrics across namespaces',
    '/logs': 'Trace and inspect every request flowing through the gateway',
  };

  let lastSection = '';

  return (
    <div className={styles.root}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarBrand}>
          <span style={{ color: '#60cdff' }}>⚡</span> Azure AI Gateway
        </div>
        <div />  {/* spacer */}
        <div className={styles.topBarRight} ref={profileRef}>
          <button className={styles.topBarIconBtn} title="Notifications">
            <Alert24Regular style={{ fontSize: 18 }} />
            <span className={styles.notifBadge}>3</span>
          </button>
          <button className={styles.topBarIconBtn} title="Settings">
            <Settings24Regular style={{ fontSize: 18 }} />
          </button>
          <button
            className={styles.profileBtn}
            onClick={() => setProfileOpen((v) => !v)}
          >
            <div className={styles.profileAvatar}>AT</div>
            <span className={styles.profileName}>Anish T.</span>
            <ChevronDown24Regular style={{ fontSize: 14 }} />
          </button>
          {profileOpen && (
            <div className={styles.profileDropdown}>
              <div className={styles.profileDropdownInfo}>
                <div className={styles.profileDropdownName}>Anish Tallapureddy</div>
                <div className={styles.profileDropdownEmail}>anishta@microsoft.com</div>
                <div className={styles.profileDropdownOrg}>Contoso Corp</div>
              </div>
              <div className={styles.profileDropdownDivider} />
              <button className={styles.profileDropdownItem}>
                <Settings24Regular style={{ fontSize: 16 }} /> Settings
              </button>
              <button
                className={styles.profileDropdownItem}
                onClick={() => {
                  setProfileOpen(false);
                  onSignOut?.();
                }}
              >
                <SignOut24Regular style={{ fontSize: 16 }} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body Row: Sidebar + Content */}
      <div className={styles.bodyRow}>
        <div className={styles.sidebar}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>⚡</div>
            <div className={styles.logoText}>Gateway</div>
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
                    className={
                      item.nested
                        ? isActive ? styles.navItemNestedActive : styles.navItemNested
                        : isActive ? styles.navItemActive : styles.navItem
                    }
                    onClick={() => navigate(item.path)}
                  >
                    {isActive ? item.activeIcon : item.icon}
                    <span>{item.label}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </nav>
          <div className={styles.sidebarFooter}>
            <button className={styles.sidebarFooterItem}>
              <DocumentText24Regular style={{ fontSize: 16 }} /> Docs
            </button>
            <button className={styles.sidebarFooterItem}>
              <PlugConnected24Regular style={{ fontSize: 16 }} /> Integration
            </button>
            <button className={styles.sidebarFooterItem}>
              <QuestionCircle24Regular style={{ fontSize: 16 }} /> Support
            </button>
            <button className={styles.sidebarFooterItem}>
              <CommentMultiple24Regular style={{ fontSize: 16 }} /> Feedback
            </button>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div>
                <Text size={500} weight="semibold">
                  {getPageTitle()}
                </Text>
                {pageSubtitles[location.pathname] && (
                  <div style={{ marginTop: '2px' }}>
                    <Text size={200} style={{ color: '#999' }}>
                      {pageSubtitles[location.pathname]}
                    </Text>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.envIndicator}>
                <div className={styles.envDot} />
                Production
              </div>
              <Text size={200} style={{ color: '#999' }}>
                Contoso Corp
              </Text>
            </div>
          </div>
          <div className={styles.main}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
