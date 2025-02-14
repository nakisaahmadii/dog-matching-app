import React, { createContext, useState, useContext } from 'react';

//Create a context object for user's name and a fucntion to modify it
const UserContext = createContext(null);

//UserProvider is a component that wraps part of the application that needs access to user state
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); //Initialize the user to null before user login

  //Value passed to provider includes the user data and a function to modify it
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}  {/* Rendering the child component that now have access to user context */}
    </UserContext.Provider>
  );
};

//Custom hook to use the user context
export const useUser = () => useContext(UserContext);
export default UserContext;
