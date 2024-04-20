import {
  AppShell,
  AppShellHeaderConfiguration,
  AppShellNavbarConfiguration,
  ColorSchemeScript,
  MantineProvider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { FormProvider } from 'react-hook-form';
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { theme } from 'style/theme';
import { ErrorBoundaryPage } from './components/ErrorPage';
import { HomePageNotAuthorized } from './components/HomePageNotAuthorized';
import { AuthPropertiesProvider } from './hooks/useAuthProperties';
import { useCloseOnResize } from './hooks/useCloseOnResize';
import { useQueryAuth } from './hooks/useQueryAuth';
import { useSearchForm } from './hooks/useSearchForm';
import { useSerilogUiProps } from './hooks/useSerilogUiProps';

const AppBody = lazy(() => import('./components/AppBody'));
const Head = lazy(() => import('./components/ShellStructure/Header'));
const Sidebar = lazy(() => import('./components/ShellStructure/Sidebar'));

const App = () => {
  const { routePrefix } = useSerilogUiProps();
  const queryClient = new QueryClient();

  const router = createBrowserRouter(
    [
      {
        ErrorBoundary: ErrorBoundaryPage,
        element: <Layout />,
        children: [
          {
            element: <Shell />,
            index: true,
          },
          {
            element: <HomePageNotAuthorized />,
            path: 'access-denied/',
          },
        ],
      },
    ],
    { basename: `/${routePrefix}/` },
  );

  if (!routePrefix) return null;

  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider defaultColorScheme="auto" theme={theme}>
        <Notifications />
        <QueryClientProvider client={queryClient}>
          <AuthPropertiesProvider>
            <RouterProvider router={router} />
          </AuthPropertiesProvider>
        </QueryClientProvider>
      </MantineProvider>
    </>
  );
};

const Layout = () => {
  const { methods } = useSearchForm();

  return (
    <FormProvider
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...methods}
    >
      <Outlet />
    </FormProvider>
  );
};

const Shell = () => {
  const { blockHomeAccess, authenticatedFromAccessDenied } = useSerilogUiProps();

  useQueryAuth();
  const [mobileOpen, { toggle: toggleMobile, close }] = useDisclosure();

  const headerProps: AppShellHeaderConfiguration = { height: '4.3em' };
  const navbarProps: AppShellNavbarConfiguration = {
    breakpoint: 'sm',
    collapsed: { mobile: !mobileOpen, desktop: true },
    width: 70,
  };

  useCloseOnResize(close);

  if (blockHomeAccess && !authenticatedFromAccessDenied)
    return <Navigate to={`access-denied`} replace />;

  return (
    <AppShell header={headerProps} navbar={navbarProps}>
      <AppShell.Header>
        <Suspense fallback={<div />}>
          <Head isMobileOpen={mobileOpen} toggleMobile={toggleMobile} />
        </Suspense>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <Suspense fallback={<div />}>
          <Sidebar />
        </Suspense>
      </AppShell.Navbar>

      <AppShell.Main>
        <Suspense fallback={<div />}>
          <AppBody hideMobileResults={mobileOpen} />
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
};

export default App;
