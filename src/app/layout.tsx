'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import Appheader from '@/components/app.header';
import Appfooter from '@/components/app.footer';
import { Bounce, ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from '@/app/Redux/Store';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
        <QueryClientProvider client={queryClient}>
        <Appheader  />
        {children}
        <Appfooter />
        </QueryClientProvider>
        </Provider>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce} />
      </body>
    </html>
  )
}
