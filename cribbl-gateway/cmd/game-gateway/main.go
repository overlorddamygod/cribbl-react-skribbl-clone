package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/api/game/create", CreateGame)
	http.HandleFunc("/api/game/find", FindGame)
	http.HandleFunc("/api/game/", GetAllGames)
	http.HandleFunc("/api/game/delete", DeleteGame)

    log.Println("Listening for requests at http://localhost:8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}