import { createContext, useContext, useReducer } from "react";

interface AuthProviderProps {
   children: React.ReactNode;
}

interface User {
   name: string;
   email: string;
   password: string;
   avatar: string;
}

interface AuthContextType {
   user: User | null;
   isAuthenticated: boolean;
   login: (email: string, password: string) => void;
   logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const initialState = {
   user: null as User | null,
   isAuthenticated: false,
};

type ACTIONTYPE = { type: "login"; payload: User } | { type: "logout" };

function reducer(state: typeof initialState, action: ACTIONTYPE): typeof initialState {
   switch (action.type) {
      case "login":
         return {
            ...state,
            user: action.payload,
            isAuthenticated: true,
         };
      case "logout":
         return {
            ...state,
            user: null,
            isAuthenticated: false,
         };
      default:
         throw new Error("Unknown action");
   }
}

const FAKE_USER = {
   name: "Jack",
   email: "jack@example.com",
   password: "qwerty",
   avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }: AuthProviderProps) {
   const [{ user, isAuthenticated }, dispatch] = useReducer(reducer, initialState);

   function login(email: string, password: string) {
      if (email === FAKE_USER.email && password === FAKE_USER.password) dispatch({ type: "login", payload: FAKE_USER });
   }

   function logout() {
      dispatch({ type: "logout" });
   }

   return (
      <AuthContext.Provider
         value={{
            user,
            isAuthenticated,
            login,
            logout,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
}

function useAuth() {
   const context = useContext(AuthContext);
   if (!context) throw new Error("useAuth has to be used within <AuthContext.Provider>");
   return context;
}

export { AuthProvider, useAuth };
