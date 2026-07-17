import { lazy, Suspense } from 'react';

const RouterDevtools = lazy(() =>
  import('@tanstack/react-router-devtools').then((m) => ({
    default: m.TanStackRouterDevtools,
  }))
);

const QueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((m) => ({
    default: m.ReactQueryDevtools,
  }))
);

export function RouterDevtoolsPanel() {
  if (!import.meta.env.DEV) return null;

  return (
    <Suspense fallback={null}>
      <RouterDevtools position="bottom-right" />
    </Suspense>
  );
}

export function QueryDevtoolsPanel() {
  if (!import.meta.env.DEV) return null;

  return (
    <Suspense fallback={null}>
      <QueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </Suspense>
  );
}
