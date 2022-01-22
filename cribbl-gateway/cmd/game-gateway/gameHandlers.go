package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func CreateGame(w http.ResponseWriter, req *http.Request) {
	enableCors(&w)
	randomServer := getRandomServer();
	fmt.Println(randomServer)
	if req.Method == "POST" {
		w.Header().Set("Content-Type", "application/json")	

		resp, err := http.Post(randomServer + "/game/create", "application/json", req.Body)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()

		createResponse := CreateGameResponse {
			randomServer,
			"",
		}

		error := json.NewDecoder(resp.Body).Decode(&createResponse)
		
		if error != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		Games = append(Games, createResponse)

		w.WriteHeader(http.StatusCreated)
		responseJson , err := json.Marshal(createResponse)
		
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write(responseJson)
	}
}

func GetAllGames(w http.ResponseWriter, req *http.Request) {
	enableCors(&w)
	if req.Method == "GET" {
		w.Header().Set("Content-Type", "application/json")	

		responseJson , err := json.Marshal(Games)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Write(responseJson)
	}
}

func FindGame(w http.ResponseWriter, req *http.Request) {
	enableCors(&w)
	if req.Method == "GET" {
		w.Header().Set("Content-Type", "application/json")	
		game, err := GetRandomGame()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		responseJson , jsonError := json.Marshal(game)

		if jsonError != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		
		w.Write(responseJson)
	}
}

func DeleteGame(w http.ResponseWriter, req *http.Request) {
	enableCors(&w)
	gameId := req.URL.Query().Get("gameId")
	fmt.Println("DELETE", gameId)

	for i, game := range Games {
		if game.GameId == gameId {
			Games = append(Games[:i], Games[i+1:]...)
			break
		}
	}
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type,sentry-trace")
}