import React from "react";

import Tweet from "./tweet";

const getTweet = (tweet, index) => {
  return (
    <Tweet
      key={index}
      text={tweet.text}
      image={tweet.entities.media && tweet.entities.media[0].media_url}
      username={tweet.user.screen_name}
    />
  );
};

class List extends React.Component {
  // TODO: cycle tweets, have only max 5
  state = {
    tweets: []
  };

  componentDidMount() {
    const conn = new WebSocket("ws://" + window.location.host + "/ws");
    // const conn = new WebSocket("ws://localhost:5000/ws");

    conn.onopen = function(e) {
      console.log("on open");
    };

    conn.onclose = function(e) {
      console.log("on close");
    };

    conn.onmessage = this.handleNewMessage;
  }

  handleNewMessage = e => {
    if (!e.data) {
      return;
    }

    const tweet = JSON.parse(e.data);

    console.log(tweet.entities.media);
    this.setState(state => ({
      ...state,
      tweets: [tweet, ...state.tweets]
    }));
  };

  render() {
    return (
      <div>
        {this.state.tweets.map(getTweet)}

        <Tweet
          text="Tweets with #EuroPython will be shown here!"
          username="europython"
        />
      </div>
    );
  }
}

export default List;
