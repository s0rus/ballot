import React, { useState, useEffect } from 'react';
import {
  PercentageContainer,
  PollContainer,
  ResultRow,
  ShareContainer,
  ShareInput,
  ShareRow,
  StatsRow,
  VoteLink,
  VoteRow,
} from '../../utils/PollElements';
import { PollID, PollState } from '../../interfaces';
import { useHistory, useParams } from 'react-router-dom';
import { firestore } from '../../firebase/config';
import { ReactComponent as Copy } from '../../assets/copy.svg';
import { formatDistance } from 'date-fns';

const PollResults = () => {
  const PUBLIC_URL = 'https://ballot-polls.netlify.app';
  const { pollid } = useParams<PollID>();
  const history = useHistory();
  const [currentResults, setCurrentResults] = useState<PollState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  useEffect(() => {
    const unsubscribeHandler = firestore
      .collection('POLLS')
      .doc(`${pollid}`)
      .onSnapshot((snapshot) => {
        const pollData: any = snapshot.data();
        setCurrentResults(pollData);
        setLoading(false);
      });
    return () => unsubscribeHandler();
  }, [pollid, history]);

  const getVoteCount = () => {
    if (currentResults) {
      return currentResults.pollOptions.reduce((acc, option) => (acc += option.voteCount), 0);
    }
    return 0;
  };

  const getVotePercentage = (voteCount: number) => {
    if (currentResults) {
      const totalVoteCount = getVoteCount();
      return Math.round((voteCount / totalVoteCount) * 100);
    }
    return 0;
  };

  const handleClipboard = () => {
    navigator.clipboard.writeText(`${PUBLIC_URL}/${pollid}`);
    setIsLinkCopied(true);
  };

  const determineTime = () => {
    if (currentResults) {
      const now = Math.floor(Date.now());
      const then = currentResults.createdAt.seconds * 1000;
      return formatDistance(then, now, { addSuffix: true, includeSeconds: true }).toLocaleUpperCase();
    }
    return 0;
  };

  return (
    <>
      {!currentResults && loading && <h1>LOADING...</h1>}
      {!currentResults && !loading && <h1>THIS PAGE DOESN'T EXIST</h1>}
      {currentResults && !loading && (
        <>
          <PollContainer>
            <VoteRow>{currentResults && <h1>{currentResults.pollTitle}</h1>}</VoteRow>
            {currentResults &&
              currentResults.pollOptions
                .sort((a, b) => b.voteCount - a.voteCount)
                .map((option) => (
                  <ResultRow key={option.optionIndex}>
                    <h2>
                      <span>{option.optionValue}</span>
                      <span>{`${option.voteCount} ${option.voteCount === 1 ? 'VOTE' : 'VOTES'}`}</span>
                    </h2>
                    <PercentageContainer votePercentage={getVotePercentage(option.voteCount) || 0}>
                      <div></div>
                      <span>{`${getVotePercentage(option.voteCount) || 0}%`}</span>
                    </PercentageContainer>
                  </ResultRow>
                ))}
            <VoteLink href={`/${pollid}`}>VOTE</VoteLink>
            <StatsRow>
              <h2>{getVoteCount()} VOTE(S)</h2>
              <h2>ASKED {determineTime()}</h2>
            </StatsRow>
          </PollContainer>
          <ShareContainer>
            <ShareRow>
              <h2>SHARE THIS POLL</h2>
            </ShareRow>
            <ShareRow>
              {currentResults && (
                <>
                  <ShareInput
                    type='text'
                    readOnly
                    value={`${PUBLIC_URL}/${pollid}`}
                    onClick={() => handleClipboard()}
                  />
                  <Copy onClick={() => handleClipboard()} />
                </>
              )}
            </ShareRow>
            <ShareRow>{isLinkCopied && <span>LINK COPIED TO CLIPBOARD</span>}</ShareRow>
          </ShareContainer>
        </>
      )}
    </>
  );
};

export default PollResults;
