import React from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import {AuthProvider} from './contexts/Auth'
import Header from './components/header/header'
import Footer from './components/footer/footer'

import Entrance from './pages/entrance'
import Words from './pages/words'
import SignIn from './pages/sign-in'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/" component={Entrance} />
          <Route path="/words" component={Words} />
          <Route path="/sign-in" component={SignIn} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
