import React, { useRef, useState, useEffect } from "react";
import Header from "../Components/Header";
import WhiteBoard from "../Components/WhiteBoard";
import io, { Socket } from "socket.io-client";
// import { io } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import Avatar from "../Components/Avatar";

const Game = ({ io, gameId }: { io: any; gameId: string }) => {
  const state = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const players = [
    {
      id: 1,
      username: "Overlord",
      img: "https://avatars.dicebear.com/api/male/lol.svg",
      position: 1,
      points: 30,
    },
    {
      id: 2,
      username: "Daimyo",
      img: "https://avatars.dicebear.com/api/bottts/sad.svg",
      position: 2,
      points: 69,
    },
  ];

  const messages = [
    {
      username: "Overlord",
      message: "Overlord: lol",
      type: "normal",
    },
    {
      username: "Daimyo",
      message: "Daimyo joined.",
      type: "joined",
    },
    {
      username: "Overlord guessed the word",
      message: "Overlord guessed the word",
      type: "guessed",
    },
  ];
  const [message, setMessage] = useState("");

  const [socket, setSocket] =
    useState<Socket<DefaultEventsMap, DefaultEventsMap>>();

  useEffect(() => {
    return () => {};
  }, []);

  const sendMessage = () => {
    io.emit("game:sendMessage", {
      gameId,
      id: "lol",
      message,
    });
    setMessage("");
  };

  return (
    <div className="">
      <Header />
      <div className="rounded flex items-center bg-yellow-50 mb-3 px-5 py-2 font-bold text-gray-600">
        <div>
          30 <span className="ml-3">Round 1 of 3</span>
        </div>
        <div className="text-center flex-1">_ _ _ _ _ _ _ _</div>
      </div>
      <div className="flex justify-between">
        <div className="w-56 rounded">
          {state.players.map((player) => {
            return (
              <div
                className="flex justify-around items-center bg-yellow-50 p-1 border border-b-1 border-white"
                key={player.id}
              >
                <div className="w-10 px-2">#{player.rank}</div>
                <div className="flex-1 text-center">
                  <div className="font-bold">{player.username}</div>
                  <div className="text-sm">Points: {player.points}</div>
                </div>
                <div></div>
                <div className="w-10 cursor-pointer">
                  <Avatar seed={player.username} alt={player.id} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mx-2 flex-1">
          <WhiteBoard io={io} gameId={gameId} />
          {/* <canvas
            ref={canvasRef}
            width="700"
            height="500"
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
          ></canvas> */}
        </div>
        <div className="flex flex-col bg-yellow-50 px-2 w-72">
          <div className="flex-1 flex flex-col justify-end">
            {state.messages.map((msg) => {
              const { type, message } = msg;
              return (
                <div
                  className={type == "normal" ? "" : "text-green-400"}
                  key={message}
                >
                  {message}
                </div>
              );
            })}
          </div>
          <input
            className="w-full border border-gray rounded px-2 mb-2"
            placeholder="Type your guess here..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key == "Enter") {
                sendMessage();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;
