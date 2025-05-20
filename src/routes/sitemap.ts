// import paths from './paths';

export interface SubMenuItem {
  name: string;
  pathName: string;
  path: string;
  active?: boolean;
  items?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  subheader: string;
  path?: string;
  icon?: string;
  avatar?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

const sitemap: MenuItem[] = [
  {
    id: 'dashboard',
    subheader: 'Dashboard',
    path: '/',
    icon: 'mingcute:home-1-fill',
    active: true,
  },
  {
    id: 'features',
    subheader: 'Commitments',
    path: '/commitments',
    icon: 'mingcute:star-fill',
    active: true,
  },
  // {
  //   id: 'users',
  //   subheader: 'Users',
  //   path: '#!',
  //   icon: 'mingcute:user-2-fill',
  // },
  {
    id: 'pricing',
    subheader: 'Expenses',
    path: '#!',
    icon: 'mingcute:currency-dollar-2-line',
  },
  // {
  //   id: 'authentication',
  //   subheader: 'Authentication',
  //   icon: 'mingcute:safe-lock-fill',
  //   items: [
  //     {
  //       name: 'Login',
  //       pathName: 'login',
  //       path: paths.login,
  //     },
  //     {
  //       name: 'Signup',
  //       pathName: 'signup',
  //       path: paths.signup,
  //     },
  //   ],
  // },
  {
    id: 'settings',
    subheader: 'Logout',
    path: '#!',
    icon: 'material-symbols:settings-rounded',
    active: true,
  },
  // {
  //   id: 'account-settings',
  //   subheader: 'John Carter',
  //   path: '#!',
  // },
];

export default sitemap;
