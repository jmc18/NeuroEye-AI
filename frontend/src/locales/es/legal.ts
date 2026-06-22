export const legal = {
  privacy: {
    title: 'Política de privacidad',
    description:
      'features/legal/pages/PrivacyPolicyPage.tsx — ruta pública sin layout especial',
    body1:
      'Esta es una página estática de ejemplo. En producción, el contenido legal viviría aquí o vendría de un CMS.',
    body2:
      'Las rutas como esta se definen en app/router/routes/privacy-policy.tsx e importan el componente desde features/legal/pages/.',
  },
  terms: {
    title: 'Términos de servicio',
    description: 'features/legal/pages/TermsPage.tsx',
    body: 'Términos de servicio de ejemplo para NeuroEyeAI.',
  },
} as const
