import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./AppRouter";
import { TokenProvider } from "./context/TokenContext";
import { LoadingProvider } from "./context/LoadingContext";
import PageLoader from "./components/PageLoader";
import { AdminProvider } from "./context/AdminContext";


function App() {
  return (
    <TokenProvider>
      <AdminProvider>
        <AuthProvider>
          <LoadingProvider>
            <PageLoader />
            <AppRouter />
          </LoadingProvider>
        </AuthProvider>
      </AdminProvider>
    </TokenProvider>
  );
}

export default App;
