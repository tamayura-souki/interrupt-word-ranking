import React, {createContext, useState, useEffect} from 'react'
import firebase from 'firebase/app'
import {auth} from '../config/firebase'

export const AuthContext = createContext({})
export const AuthProvider = ({children}:any) => {
  const [currentUser, setCurrentUser] = useState<firebase.User|null>(null)

  const signout = async () => {
    await auth.signOut()
  }

  useEffect(() => {
    auth.onAuthStateChanged(setCurrentUser)
  }, [])

  return(
    <AuthContext.Provider value={{currentUser, signout}}>
      {children}
    </AuthContext.Provider>
  )
}