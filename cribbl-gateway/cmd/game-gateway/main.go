package main

import (
	"github.com/overlorddamygod/cribbl-react-skribbl-clone/cmd/game-gateway/handlers"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/api/game/create", handlers.CreateGame)
	http.HandleFunc("/api/game/find", handlers.FindGame)
	http.HandleFunc("/api/game/", handlers.GetAllGames)
	http.HandleFunc("/api/game/delete", handlers.DeleteGame)

	log.Println("Listening for requests at http://localhost:8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
