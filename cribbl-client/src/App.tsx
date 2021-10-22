import { useRef, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Index from "./pages/index";
import Lobby from "./pages/lobby";
import Game from "./pages/game";
import { set_username } from "./store/profile/profileSlice";
import { useAppDispatch } from "./store/hooks";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const uname = localStorage.getItem("username");

    if (uname) {
      dispatch(set_username(uname));
    }
  }, []);

  return (
    <div className="h-full w-[95%] m-auto">
      <Router>
        <Switch>
          <Route path="/lobby/:gameId">
            <Lobby />
          </Route>
          <Route path="/game/:gameId">{/* <Game /> */}</Route>
          <Route exact path="/">
            <Index />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
