import { AuthProvider } from '../context/AuthContext';
import { Routes } from './routes';

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
