import React, { useState } from "react";

export const AuthContext = React.createContext({
  authState: { email: "", name: "", id: "", loggedIn: false, currentWorkout: -1},
  setAuthState: () => {}
});
