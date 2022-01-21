import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import WhiteBoard from "../Components/WhiteBoard";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import Avatar from "../Components/Avatar";
import { useDispatch } from "react-redux";
import Brush from "../assets/img/pen.gif";
import { set_startEnd } from "../store/game/gameSlice";
import { Profile } from "../store/profile/profileSlice";

const useCounter = (endTimeStamp: number) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nowTimeStamp = now.getTime();
      const diff = endTimeStamp - nowTimeStamp;
      const seconds = Math.floor(diff / 1000);
      if (seconds < 0) {
        clear();
      } else {
        setTimeLeft(seconds);
      }
    }, 1000);

    const clear = () => {
      clearInterval(timer);
    };
    return () => {
      clear();
    };
  }, [endTimeStamp]);
  return timeLeft;
};

const Game = ({
  io,
  gameId,
  profile,
}: {
  io: any;
  gameId: string;
  profile: Profile;
}) => {
  const state = useAppSelector((state) => state.game);

  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const sendMessage = () => {
    io.emit("game:sendMessage", {
      gameId,
      profile,
      message,
    });
    setMessage("");
  };

  useEffect(() => {
    io.on("game:startTime", (time: { start: number; end: number }) => {
      console.log(time);
      dispatch(set_startEnd(time));
    });
  }, []);

  const timeLeft = useCounter(state.startEnd.end);

  return (
    <div className="">
      <Header />
      <div className="rounded flex items-center bg-yellow-50 mb-3 px-5 py-2 font-bold text-gray-600">
        <div>
          {timeLeft} <span className="ml-3">Round {state.round} of {state.rounds}</span>
        </div>
        <div className="text-center flex-1 tracking-[3px]">{state.word}</div>
      </div>
      <div className="flex justify-between h-[600px]">
        <div className="w-56 min-w-[224px] rounded">
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
                <div>{player.id == state.turn.id && <img src={Brush} />}</div>
                <div className="w-10 cursor-pointer text-center text-yellow-300">
                  <Avatar seed={player.username} alt={player.id} />
                  <div className="text-xs">{ player.id == profile.id && "You"}</div>
                  <div className="text-xs">{ state.creator == player.id && "Admin"}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mx-2 flex-1">
          <WhiteBoard io={io} gameId={gameId} />
        </div>
        <div className="flex flex-col bg-yellow-50 px-2 w-80 min-w-[320px] h-full">
          <div className="flex-1 flex flex-col justify-end overflow-auto">
            {state.messages.map((msg) => {
              const { _type, message, username } = msg;
              return (
                <div
                  className={getMessageColor(_type)}
                  key={message}
                >
                  {_type == "normal" && `${username}: `} {message}
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

const getMessageColor = (type: string) => {
  if ( type == "join" ) {
    return "text-green-400";
  }

  if ( type == "correct" ) {
    return "text-green-600";
  }
  
  if ( type == "leave" ) {
    return "text-red-400";
  }
  return ""
};

export default Game;
