import React from "react";

import styled from "styled-components";

const TweetText = styled.div`
  background-color: ${props => props.hasImage ? '#ffb81c' : '#00b5e5'};
  color: white;
  padding: 20px;
  font-family: ubuntu mono;
`;

const TweetImage = styled.img`
  width: 100%;
  height: auto;
`;

const TweetContainer = styled.div`
  max-width: 500px;
  margin: 50px auto;
  display: flex;
  flex-direction: column;
`;
const TweetUser = styled.span`font-weight: bold;`;

const Tweet = ({ text, username, image }) =>
  <TweetContainer>
    {image && <TweetImage src={image} />}
    <TweetText hasImage={!!image}>
      <TweetUser>
        @{username}
      </TweetUser>
      {' '}
      {text}
    </TweetText>
  </TweetContainer>;

export default Tweet;
