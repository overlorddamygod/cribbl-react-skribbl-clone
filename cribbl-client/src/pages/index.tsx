import { useEffect, useState } from "react";
import * as style from "@dicebear/avatars-bottts-sprites";
import { createAvatar } from "@dicebear/avatars";
import { Link, useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { set_username, set_server } from "../store/profile/profileSlice";
import { GATEWAY_PATH } from "../config";
import Load from "../assets/img/load.gif";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Index = () => {
  const [avatarSvg, setAvatarSvg] = useState("");
  const username = useAppSelector((state) => state.profile.username);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const query = useQuery();

  useEffect(() => {
    setAvatarSvg(
      createAvatar(style, {
        seed: username,
      })
    );
    return () => {};
  }, [username]);

  const playGame = async () => {
    const gameId = query.get("id");
    const server = query.get("server");

    setLoading(true);
    if (gameId && server) {
      dispatch(set_server(server));
      history.push(`lobby/${gameId}`);
      setLoading(false);
    } else {
      // get games
      try {
        const res = await axios.get(`${GATEWAY_PATH}/api/game/find`);

        type GameRes = {
          gameId: string;
          server: string
        };

        const data = res.data as GameRes;
        console.log(data)

        if (data.gameId.length > 0) {
          dispatch(set_server(data.server));

          history.push(`lobby/${data.gameId}`);
      
          setLoading(false);

        } else {
          createGame();
        }
      } catch (err) {
        console.log("HERE")
        createGame();

        console.error(err);
        setLoading(false);
      }
    }
  };

  const createGame = async () => {
    setLoading(true);

    try {
      const res = await axios.post(`${GATEWAY_PATH}/api/game/create`, {
        username,
      });

      type CreateGameRes = {
        gameId: string;
        player: {
          id: string;
          username: string;
        };
        server: string;
      };

      const data = res.data as CreateGameRes;

      console.log(res);
      dispatch(set_server(data.server));
      history.push(`lobby/${data.gameId}`);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="h-full dead-center">
      {loading ? <img src={Load} alt="loading" /> : 
      <div className="bg-white p-3 rounded md:w-1/4">
        <input
          className="border border-gray-400 rounded w-full px-3 py-1"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => dispatch(set_username(e.target.value))}
        />
        <div className="my-2 flex justify-center w-full">
          <div
            className="h-40 w-40"
            dangerouslySetInnerHTML={{ __html: avatarSvg }}
          ></div>
        </div>
        <button
          className="block bg-green-500 hover:bg-green-600 w-full text-white rounded h-10 mt-4 mb-1"
          onClick={playGame}
        >
          Play
        </button>
        {/* <Link to="lobby/lol"> */}
        <button
          className="block bg-blue-500 hover:bg-blue-600 w-full text-white rounded h-8"
          onClick={createGame}
        >
          Create Private Room
        </button>
        {/* </Link> */}
      </div>
}
    </div>
  );
};

export default Index;
