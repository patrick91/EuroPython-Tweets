package main

import (
	"log"
	"net/http"
	"os"

	"github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
)

func main() {
	go h.run()

	config := oauth1.NewConfig(
		os.Getenv("TWITTER_CONSUMER_KEY"),
		os.Getenv("TWITTER_CONSUMER_SECRET"),
	)
	token := oauth1.NewToken(
		os.Getenv("TWITTER_ACCESS_TOKEN"),
		os.Getenv("TWITTER_ACCESS_TOKEN_SECRET"),
	)
	httpClient := config.Client(oauth1.NoContext, token)
	twitterClient := twitter.NewClient(httpClient)

	stream := NewLiveStream("europython,#europython,ep2017,ep17", twitterClient, h)

	defer stream.Stop()

	stream.Run()

	http.Handle("/", http.FileServer(http.Dir("./frontend/build")))
	http.HandleFunc("/ws", serveWs)
	log.Fatal(http.ListenAndServe(":80", nil))
}
