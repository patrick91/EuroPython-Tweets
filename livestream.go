package main

import (
	"log"
	"strings"

	"github.com/dghubble/go-twitter/twitter"
)

// LiveStream ...
type LiveStream struct {
	hub        hub
	client     *twitter.Client
	stream     *twitter.Stream
	demux      *twitter.SwitchDemux
	searchTerm string
}

// Run starts the livestream
func (livestream *LiveStream) Run() {
	log.Printf("Starting `%s` Stream...\n", livestream.searchTerm)

	// FILTER
	filterParams := &twitter.StreamFilterParams{
		Track:         []string{livestream.searchTerm},
		StallWarnings: twitter.Bool(true),
	}

	stream, err := livestream.client.Streams.Filter(filterParams)

	if err != nil {
		log.Fatal(err)
	}

	// Receive messages until stopped or stream quits
	go livestream.demux.HandleChan(stream.Messages)

	livestream.stream = stream
}

// Stop stops the livestream
func (livestream *LiveStream) Stop() {
	livestream.stream.Stop()
}

func (livestream *LiveStream) makeDemux() {
	// Convenience Demux demultiplexed stream messages
	demux := twitter.NewSwitchDemux()
	demux.Tweet = func(tweet *twitter.Tweet) {
		if tweet.Retweeted || strings.HasPrefix(tweet.Text, "RT @") {
			return
		}

		log.Println(tweet.Text)
		livestream.hub.BroadcastTweet(tweet)
	}

	livestream.demux = &demux
}

// NewLiveStream creates a new live stream with the passed twitter client
// and store
func NewLiveStream(searchTerm string, client *twitter.Client, hub hub) *LiveStream {
	livestream := &LiveStream{
		client:     client,
		hub:        hub,
		searchTerm: searchTerm,
	}

	livestream.makeDemux()

	return livestream
}
