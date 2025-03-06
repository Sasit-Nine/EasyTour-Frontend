import './App.css';
import CustomerApp from './customers-side/CustomerApp';
import AdminApp from './admin-side/AdminApp';
import { useAuth } from './context/AuthContext';
import { useMemo } from 'react';

function App() {
  const { user, loading } = useAuth();

  const AppComponent = useMemo(() => {
    if (loading) {
      const LoadingComponent = () => (
        <div>
          <div className="flex justify-center items-center space-x-2">
            <div className="w-4 h-4 bg-[#F8644B] rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-[#F8644B] rounded-full animate-bounce200"></div>
            <div className="w-4 h-4 bg-[#F8644B] rounded-full animate-bounce400"></div>
          </div>
        </div>
      );
      LoadingComponent.displayName = "LoadingComponent";
      return LoadingComponent;
    }
    if (!user) {
      return CustomerApp;
    }
    return user.role?.name === "Admin" ? AdminApp : CustomerApp;
  }, [user, loading]);

  return <AppComponent />;
}

export default App;