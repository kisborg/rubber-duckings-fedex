import React, { useEffect } from 'react';
import {
  BrowserRouter as
  Router,
  Switch,
  Route,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Challenge from './pages/Challenge';
import AdminPage from './pages/AdminPage';
import VerificationPage from './pages/VerificationPage';
import './App.css';
import { getChallengeAsync } from './redux/challenge/challenge.action';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getChallengeAsync());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route path="/challenge" component={Challenge} />
          <Route exact path="/admin" component={AdminPage} />
          <Route exact path="/verification/:userId/:verificationToken" component={VerificationPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
