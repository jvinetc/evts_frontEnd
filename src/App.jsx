import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./AppRouter";
import { TokenProvider } from "./context/TokenContext";


function App() {
  return (
    <TokenProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </TokenProvider>
  );
}

export default App;
