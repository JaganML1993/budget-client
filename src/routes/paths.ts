export const rootPaths = {
  root: '/',
  pagesRoot: 'pages',
  authRoot: 'authentication',
  errorRoot: 'error',
};

export default {
  dashboard: `/${rootPaths.pagesRoot}/dashboard`,
  commitments: `/${rootPaths.pagesRoot}/commitments`,
  createCommitment: `/${rootPaths.pagesRoot}/commitments/create`,
  editCommitment: `/${rootPaths.pagesRoot}/commitments/edit/:id`,
  CommitmentHistory: `/${rootPaths.pagesRoot}/commitmentHistory/:id`,
  createCommitmentHistory: `/${rootPaths.pagesRoot}/commitmentHistory/create/:commitmentId`,
  features: `/${rootPaths.pagesRoot}/features`,
  users: `/${rootPaths.pagesRoot}/users`,
  pricing: `/${rootPaths.pagesRoot}/pricing`,
  integrations: `/${rootPaths.pagesRoot}/integrations`,
  settings: `/${rootPaths.pagesRoot}/settings`,
  templatePages: `/${rootPaths.pagesRoot}/template-pages`,
  accountSettings: `/${rootPaths.pagesRoot}/account-settings`,

  login: `/${rootPaths.authRoot}/login`,
  signup: `/${rootPaths.authRoot}/sign-up`,
  forgotPassword: `/${rootPaths.authRoot}/forgot-password`,
  comingSoon: `/coming-soon`,
  404: `/${rootPaths.errorRoot}/404`,
};
