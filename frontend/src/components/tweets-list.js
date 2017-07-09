import React from "react";

import Tweet from "./tweet";

const getTweet = (tweet, index) => {
  return (
    <Tweet
      key={index}
      text={tweet.text}
      image={tweet.image}
      username={tweet.username}
    />
  );
};

class List extends React.Component {
  // TODO: cycle tweets, have only max 5
  state = {
    tweets: []
  };

  componentDidMount() {
    var evtSource = new EventSource("http://ep.patrick.wtf:5000/tweets");
    evtSource.onmessage = this.handleNewMessage;
  }

  handleNewMessage = e => {
    const tweet = JSON.parse(e.data);

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
