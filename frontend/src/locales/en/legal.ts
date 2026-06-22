export const legal = {
  privacy: {
    title: 'Privacy Policy',
    description: 'features/legal/pages/PrivacyPolicyPage.tsx — public route without special layout',
    body1:
      'This is an example static page. In production, legal content would live here or come from a CMS.',
    body2:
      'Routes like this are defined in app/router/routes/privacy-policy.tsx and import the component from features/legal/pages/.',
  },
  terms: {
    title: 'Terms of Service',
    description: 'features/legal/pages/TermsPage.tsx',
    body: 'Example terms of service for NeuroEyeAI.',
  },
} as const
