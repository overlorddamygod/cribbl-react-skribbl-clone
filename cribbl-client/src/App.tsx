import { useRef, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Index from "./pages/index";
import Lobby from "./pages/lobby";
import Game from "./pages/game";
import { set_profile, set_username } from "./store/profile/profileSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import Signin from "./pages/Signin";

const App = () => {
  const dispatch = useAppDispatch();

  const profile = useAppSelector((state) => state.profile);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const id = localStorage.getItem("id");
    const user_id = localStorage.getItem("user_id");
    const access_token = localStorage.getItem("access_token");

    if (username && id && access_token) {
      dispatch(set_profile({
        id,
        user_id,
        username,
        access_token,
      }));
    }
  }, []);
  console.log(profile)
  return (
    <div className="h-full w-[95%] m-auto">
      <Router>
        { profile.user_id ? 
        <Switch>
          <Route path="/lobby/:gameId">
            <Lobby />
          </Route>
          <Route path="/game/:gameId">{/* <Game /> */}</Route>
          <Route exact path="/">
            <Index />
          </Route>
        </Switch>
        : <Switch>
          <Route exact path="/">
            <Signin />
          </Route>
        </Switch>
  }
      </Router>
    </div>
  );
};

export default App;
