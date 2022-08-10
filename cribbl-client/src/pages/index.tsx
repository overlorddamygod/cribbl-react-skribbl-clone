import { useEffect, useState } from "react";
import * as style from "@dicebear/avatars-bottts-sprites";
import { createAvatar } from "@dicebear/avatars";
import { Link, useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { set_username,set_profile  } from "../store/profile/profileSlice";
import { SOCKET_PATH } from "../config";
import Load from "../assets/img/load.gif";


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Index = () => {
  const [avatarSvg, setAvatarSvg] = useState("");
  const username = useAppSelector((state) => state.profile.username);
  const profile = useAppSelector((state) => state.profile);
  const [password, setPassword] = useState("");
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
    setLoading(true);
    if (gameId) {
      history.push(`lobby/${gameId}`);
      setLoading(false);
    } else {
      // get games
      try {
        const res = await axios.get(`${SOCKET_PATH}/game/find`, {
          headers: {
            Authorization: profile.access_token
          }
        });

        type GameRes = {
          gameId: string;
        };

        const data = res.data as GameRes;

        if (data.gameId.length > 0) {
          history.push(`lobby/${data.gameId}`);
          setLoading(false);
        } else {
          createGame();
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
  };

  const createGame = async () => {
    setLoading(true);

    try {
      const res = await axios.post(`${SOCKET_PATH}/game/create`, {
        username,
      }, {
        headers: {
          Authorization: profile.access_token
        }
      });

      type CreateGameRes = {
        gameId: string;
        player: {
          id: string;
          username: string;
        };
      };

      const data = res.data as CreateGameRes;

      console.log(res);
      history.push(`lobby/${data.gameId}`);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="h-full dead-center">
      {loading ? (
        <img src={Load} alt="loading" />
      ) : (
        <div className="bg-white p-3 rounded md:w-1/4">
          <div className="flex justify-between my-2">
            <div>Hello {profile.username}</div>
            <button className="block bg-blue-500 hover:bg-blue-600 px-2 text-white rounded h-8" onClick={
              () => {
                dispatch(set_profile({
                  id: "",
                  username: "",
                  access_token: ""
                }));
              }
            }>
              Sign Out
            </button>
          </div>
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
          {/* <button
            className="block bg-blue-500 hover:bg-blue-600 w-full text-white rounded h-8"
            onClick={createGame}
          >
            Create Private Room
          </button> */}
          {/* </Link> */}
        </div>
      )}
    </div>
  );
};

export default Index;
