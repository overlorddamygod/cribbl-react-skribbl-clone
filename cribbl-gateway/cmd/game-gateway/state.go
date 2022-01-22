package main

import (
	"fmt"
	"math/rand"
)

var Servers []string = []string{
	"http://localhost:3001",
	"http://localhost:3002",
}

func getRandomServer() string {
	randomIndex := rand.Intn(len(Servers))
    return Servers[randomIndex]
}

type CreateGameResponse struct {
	Server string `json:"server"`
	GameId string `json:"gameId"`
}

var Games []CreateGameResponse

func GetRandomGame() (CreateGameResponse, error) {
	if len(Games) == 0 {
		return CreateGameResponse{}, fmt.Errorf("No games available")
	}
	randomIndex := rand.Intn(len(Games))

	return Games[randomIndex], nil
}