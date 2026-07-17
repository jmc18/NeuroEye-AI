import { createFileRoute, redirect } from '@tanstack/react-router';

import { LoginPage } from '@features/auth/pages/LoginPage';
import { resolveReturnUrl } from '@features/auth/lib/returnUrl';
import { loginSearchSchema } from '@features/auth/schemas/loginSearch';

export const Route = createFileRoute('/_auth/login')({
  validateSearch: loginSearchSchema,
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: resolveReturnUrl(search.returnUrl),
      });
    }
  },
  component: LoginPage,
  head: () => ({
    meta: [{ title: 'Login | NeuroEyeAI' }],
  }),
});
