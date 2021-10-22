import axios from "axios";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import Avatar from "../Components/Avatar";
import Header from "../Components/Header";
import { SOCKET_PATH } from "../config";

// import useSocket from "../hooks/socket";
import {
  add_player,
  remove_player,
  selectGameState,
  set_customWords,
  set_drawTime,
  set_players,
  set_rounds,
  Screen,
  showLobby,
  showGame,
  add_message,
  set_initial,
  set_creator,
  clear_game_state,
  set_turn,
} from "../store/game/gameSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { set_id } from "../store/profile/profileSlice";
import Game from "./game";

type Player = {
  id: string;
  username: string;
};

// type GameState = {
//   rounds: number;
//   drawTime: number;
//   customWords: string;
//   players: Player[];
// };

const Lobby = (props: any) => {
  const profile = useAppSelector((state) => state.profile);
  const state = useAppSelector((state) => state.game);
  const { gameId } = useParams() as { gameId: string };
  const history = useHistory();
  const location = useLocation();

  // const { i, startGame, setRounds, setDrawTime, setCustomWords } =
  //   useSocket(gameId);
  const dispatch = useAppDispatch();

  // const [state, setState] = useState<GameState>({
  //   rounds: 2,
  //   drawTime: 80,
  //   customWords: "",
  //   players: [],
  // });

  const [i, setI] = useState<Socket<DefaultEventsMap, DefaultEventsMap>>();

  useEffect(() => {
    // const gameId = location;
    if (gameId) {
      const _i = io(SOCKET_PATH, {
        transports: ["websocket"],
      });
      // getDetails();

      setI(_i);
    }
  }, []);

  useEffect(() => {
    if (!i) return;

    i.on("game:joined", addPlayer);
    i.on("game:state", (d) => {
      dispatch(set_id(i.id));
      dispatch(set_initial(d));
      console.log("STATE", d);
    });
    i.on("game:disconnected", removePlayer);
    i.on("game:404", () => {
      // alert("Game doesn't exist");
      history.push("/");
    });
    i.on("game:started", () => startGame(false));
    i.on("game:message", (msg) => {
      dispatch(add_message(msg));
    });
    i.on("game:rounds", (rounds) => {
      setRounds(+rounds, false);
    });
    i.on("game:drawTime", (drawTime) => {
      setDrawTime(+drawTime, false);
    });
    i.on("game:customWords", (customWords) => {
      setCustomWords(customWords, false);
    });
    i.on("game:creator", (creatorId) => {
      dispatch(set_creator(creatorId));
    });
    i.on("game:turn", (turnPlayer) => {
      dispatch(set_turn(turnPlayer));
    });
    i.on("game:allRoundsFinished", () => {
      dispatch(showLobby());
    });
    i.on("disconnect", () => {
      // alert("disconnected");
      console.log("DISCONNEDTEDDDDDDD");
    });

    i.emit("game:join", {
      id: gameId,
      username: profile.username || localStorage.getItem("username") || "LOL",
    });

    return () => {
      i!.close();
      dispatch(clear_game_state());
    };
  }, [i]);

  const addPlayer = (player: Player) => {
    console.log("Player added");
    dispatch(add_player(player));
    dispatch(
      add_message({
        type: "normal",
        message: `${player.username} joined the game.`,
      })
    );
  };

  const removePlayer = (playerId: string) => {
    console.log("Player removed");
    dispatch(remove_player(playerId));
    // dispatch(add_message({
    //   type: "normal",
    //   message: `${player.username} left the game.`
    // }));
  };

  const setRounds = (val: number, emit = true) => {
    dispatch(set_rounds(val));
    if (emit)
      i!.emit(`game:set:rounds`, {
        id: gameId,
        rounds: val,
      });
  };
  const setDrawTime = (val: number, emit = true) => {
    dispatch(set_drawTime(val));
    if (emit)
      i!.emit(`game:set:drawTime`, {
        id: gameId,
        drawTime: val,
      });
  };

  const setCustomWords = (val: string, emit = true) => {
    dispatch(set_customWords(val));
    if (emit)
      i!.emit(`game:set:customWords`, {
        id: gameId,
        customWords: val,
      });
  };

  const startGame = (emit = true) => {
    if (emit)
      i!.emit(`game:start`, {
        id: gameId,
      });
    dispatch(showGame());
  };

  const isCreator = useMemo(
    () => {
      return state.creator === profile.id;
    },
    [state.creator, profile.id],
  );

  if (state.screen == Screen.lobby)
    return (
      <div className="h-full">
        <Header />
        <div className="flex justify-between">
          <div className="w-1/2 md:w-5/12">
            <h2 className="text-white text-3xl text-center mb-2">Settings</h2>
            <div className="bg-white">
              <h3 className="border-b text-2xl text-center py-1">Lobby</h3>
              <div className="p-3">
                <SelectInput
                  title="Rounds"
                  value={state.rounds}
                  disabled={!isCreator}
                  onValueChange={(val) => {
                    if (!isCreator) return
                    setRounds(val);
                  }}
                  options={[2, 3, 4, 5, 6]}
                />
                <SelectInput
                  title="Draw time in seconds"
                  value={state.drawTime}
                  disabled={!isCreator}
                  onValueChange={(val) => {
                    if (!isCreator) return

                    setDrawTime(val);
                  }}
                  options={Array.from({ length: 16 }, (v, i) => i * 10 + 30)}
                />
                <Label title="Custom Words" />
                <textarea
                  value={state.customWords}
                  disabled={!isCreator}
                  className="w-full rounded px-3 py-1 border border-gray-400 mb-3"
                  placeholder="Type your custom words here separated by comma."
                  onChange={(e) => {
                    if (!isCreator) return
                    setCustomWords(e.target.value);
                  }}
                />
                <button
                  disabled={!isCreator}
                  className="block bg-green-500 hover:bg-green-600 disabled:opacity-50 w-full text-white rounded h-10"
                  onClick={startGame}
                >
                  Start Game
                </button>
              </div>
            </div>
          </div>
          <div className="w-1/2 md:w-5/12">
            <h2 className="text-white text-3xl text-center mb-2">Players</h2>
            <div className="grid grid-cols-2 md:grid-cols-5">
              {state.players.map((player) => {
                return (
                  <div
                    className="flex flex-col text-white text-sm text-center cursor-pointer"
                    key={player.id}
                  >
                    <Avatar seed={player.username} alt={player.id} />

                    <div className="mt-2 sm:text-sm md:text-xl">
                      {player.username}
                    </div>
                    {player.id == profile.id && (
                      <div className="text-yellow-300">You</div>
                    )}
                    {player.id == state.creator && (
                      <div className="text-yellow-300">Admin</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <h1 className="text-4xl text-white">Invite your friends!</h1>
          <HoverableDiv link={`http://localhost:3000?id=${gameId}`} />
        </div>
      </div>
    );
  else if (state.screen == Screen.game) {
    return <Game io={i} gameId={gameId} profile={profile}/>;
  } else {
    return <></>;
  }
};

const HoverableDiv = ({ link }: { link: string }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="flex bg-white mt-4">
      <div
        className="flex-1 text-md py-1"
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {hovered ? (
          link
        ) : (
          <div className="text-yellow-500">
            Hover over me to see the invite link!
          </div>
        )}
      </div>
      <button
        className="w-16 bg-yellow-500 hover:bg-yellow-600 text-white"
        onClick={() => {
          navigator.clipboard.writeText(link);
        }}
      >
        Copy
      </button>
    </div>
  );
};

const Label = ({ title }: { title: string }) => {
  return <label className="block font-bold text-sm mb-1">{title}</label>;
};

type SelectInputProps = {
  title: string;
  value: number;
  options: Array<number>;
  disabled?: boolean;
  onValueChange: (val: number) => void;
};

const SelectInput = ({
  title,
  value,
  options,
  disabled = false,
  onValueChange,
}: SelectInputProps) => {
  return (
    <>
      <Label title={title} />
      <select
        value={value}
        disabled={disabled}
        className="w-full rounded px-3 py-1 border border-gray-400 mb-3"
        onChange={(e) => onValueChange(+e.target.value)}
      >
        {options.map((optionVal) => {
          return (
            <option key={optionVal} value={optionVal}>
              {optionVal}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default Lobby;
