import { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        // decode the token to get the user information
        const decodedToken = jwtDecode(token);
        console.log('decodedToken:', decodedToken);
        return decodedToken; // decoded token should contain user info
      } catch (error) {
        console.error('Error decoding token:', error);
        Cookies.remove('token');
      }
    }
    return null;    
  });
  
  // update cookies whenever user changes
  useEffect(() => {
  const expirationTime = new Date(Date.now() + 3600000);  
    if (user) {
      const token = Cookies.get('token'); 
      Cookies.set('token', token, { expires: expirationTime });
    } else {
      Cookies.remove('token');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
