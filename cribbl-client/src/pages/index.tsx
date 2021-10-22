import { useEffect, useState } from "react";
import * as style from "@dicebear/avatars-bottts-sprites";
import { createAvatar } from "@dicebear/avatars";
import { Link, useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { set_username } from "../store/profile/profileSlice";
import { SOCKET_PATH } from "../config";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Index = () => {
  const [avatarSvg, setAvatarSvg] = useState("");
  const username = useAppSelector((state) => state.profile.username);
  const dispatch = useAppDispatch();

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

    if (gameId) {
      history.push(`lobby/${gameId}`);
    } else {
      // get games
      try {
        const res = await axios.get(`${SOCKET_PATH}/game/find`);

        type GameRes = {
          gameId: string;
        };

        const data = res.data as GameRes;

        if (data.gameId.length > 0) {
          history.push(`lobby/${data.gameId}`);
        } else {
          createGame();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const createGame = async () => {
    try {
      const res = await axios.post(`${SOCKET_PATH}/game/create`, {
        username,
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-full dead-center">
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
    </div>
  );
};

export default Index;
