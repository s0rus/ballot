import React, { useCallback, useEffect, useState } from 'react';
import {
  Checkbox,
  PollContainer,
  PollOption,
  PollOptions,
  PollRow,
  PollRows,
  ShareContainer,
  ShareInput,
  ShareRow,
  VoteButton,
  VoteLink,
  VoteRow,
} from '../../utils/PollElements';
import { ReactComponent as Lock } from '../../assets/lock.svg';
import { ReactComponent as LockOpen } from '../../assets/lock-open.svg';
import { ReactComponent as SingleOption } from '../../assets/done.svg';
import { ReactComponent as MultipleOptions } from '../../assets/done-multiple.svg';
import { ReactComponent as Copy } from '../../assets/copy.svg';
import { useHistory, useParams } from 'react-router-dom';
import { firestore } from '../../firebase/config';
import { PollID, PollProps, PollState } from '../../interfaces';
import { formatDistance } from 'date-fns';

const PollVoter: React.FC = () => {
  const PUBLIC_URL = 'http://localhost:3000';
  const { pollid } = useParams<PollID>();
  const history = useHistory();
  const [currentPoll, setCurrentPoll] = useState<PollState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<boolean[] | null>(null);
  const [voted, setVoted] = useState(false);

  const getPollData = useCallback(async () => {
    let pollData: PollState[] | any = [];
    await firestore
      .collection('POLLS')
      .where('pollID', '==', pollid)
      .get()
      .then((data) => data.forEach((doc) => pollData.push(doc.data())));

    return pollData[0];
  }, [pollid]);

  useEffect(() => {
    (async () => {
      const nextPoll: PollState | null = await getPollData();
      setCurrentPoll(nextPoll);
      const checkedList = Array.from(
        { length: nextPoll?.pollOptions.length || 2 },
        (value: boolean) => (value = false)
      );
      setSelectedOptions(checkedList);
      setLoading(false);
    })();
  }, [getPollData]);

  useEffect(() => {
    document.cookie.match(`r_${pollid}`) ? setVoted(true) : setVoted(false);
  }, [pollid]);

  const handleClipboard = () => {
    navigator.clipboard.writeText(`${PUBLIC_URL}/${pollid}`).then(() => setIsLinkCopied(true));
  };

  const handleOptionCheck = (optionIndex: number, pollType: string) => {
    if (selectedOptions) {
      if (pollType === 'checkbox') {
        const newSelectedOptions = selectedOptions.map((option, index) => (index === optionIndex ? !option : option));
        setSelectedOptions(newSelectedOptions);
      } else {
        const newSelectedOptions = selectedOptions.map((option, index) => (index === optionIndex ? true : false));
        setSelectedOptions(newSelectedOptions);
      }
    }
  };

  const getPollOptions = async () => {
    let pollData: PollState[] | any = [];
    await firestore
      .collection('POLLS')
      .where('pollID', '==', pollid)
      .get()
      .then((data) => data.forEach((doc) => pollData.push(doc.data())));
    return pollData[0].pollOptions;
  };

  const incrementVotes = async () => {
    if (selectedOptions) {
      const pollOptions = await getPollOptions();
      pollOptions.map((option: PollProps, optionIndex: number) =>
        selectedOptions[optionIndex] ? option.voteCount++ : option.voteCount
      );

      await firestore
        .collection('POLLS')
        .doc(`${pollid}`)
        .update({
          pollOptions,
        })
        .then(() => (document.cookie = `r_${pollid}=1; path=/${pollid};`))
        .then(() => history.push(`/${pollid}/r`));
    }
  };

  const handleVote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    incrementVotes();
  };

  const getDuplicationIndicator = () => {
    if (currentPoll) {
      switch (currentPoll.duplicationOption) {
        case 'IP_DUPLICATION_CHECKING':
          return (
            <>
              <Lock />
              <span>THIS POLL HAS IP DUPLICATION CHECKING ENABLED</span>
            </>
          );
        case 'BROWSER_DUPLICATION_CHECKING':
          return (
            <>
              <Lock />
              <span>THIS POLL HAS BROWSER DUPLICATION CHECKING ENABLED</span>
            </>
          );
        default:
          return (
            <>
              <LockOpen />
              <span>THIS POLL HAS NO DUPLICATION CHECKING ENABLED</span>
            </>
          );
      }
    }
  };

  const determineTime = () => {
    if (currentPoll) {
      const now = Math.floor(Date.now());
      const then = currentPoll.createdAt.seconds * 1000;
      return formatDistance(then, now, { addSuffix: true, includeSeconds: true }).toLocaleUpperCase();
    }
    return 0;
  };

  return (
    <>
      {!currentPoll && loading && <h1>LOADING...</h1>}
      {!currentPoll && !loading && <h1>THIS PAGE DOESN'T EXIST</h1>}
      {currentPoll && !loading && (
        <>
          {!voted ? (
            <>
              <PollContainer>
                <form>
                  <PollRows>
                    <VoteRow>{currentPoll && <h1>{currentPoll.pollTitle}</h1>}</VoteRow>
                    {currentPoll &&
                      currentPoll.pollOptions.map((pollOption, optionIndex) => (
                        <VoteRow key={optionIndex}>
                          <label htmlFor={`option${optionIndex}`}>
                            <Checkbox
                              type={currentPoll.multipleChoice ? 'checkbox' : 'radio'}
                              id={`option${optionIndex}`}
                              name='options'
                              onChange={() =>
                                handleOptionCheck(optionIndex, currentPoll.multipleChoice ? 'checkbox' : 'radio')
                              }
                              checked={(selectedOptions && selectedOptions[optionIndex]) || false}
                            />
                            <span>{pollOption.optionValue}</span>
                          </label>
                        </VoteRow>
                      ))}
                  </PollRows>
                  <PollOptions>
                    <VoteButton onClick={handleVote}>VOTE</VoteButton>
                    <VoteLink href={`/${pollid}/r`}>RESULTS</VoteLink>
                    <PollOption>{getDuplicationIndicator()}</PollOption>
                    <PollOption>
                      {currentPoll && currentPoll.multipleChoice ? (
                        <>
                          <MultipleOptions />
                          <span>MULTIPLE OPTIONS ARE ALLOWED</span>
                        </>
                      ) : (
                        <>
                          <SingleOption />
                          <span>MULTIPLE OPTIONS ARE NOT ALLOWED</span>
                        </>
                      )}
                    </PollOption>
                    <PollOption>
                      <h2>ASKED {determineTime()}</h2>
                    </PollOption>
                  </PollOptions>
                </form>
              </PollContainer>
            </>
          ) : (
            <PollContainer>
              <PollRows>
                <VoteRow>{currentPoll && <h1>{currentPoll.pollTitle}</h1>}</VoteRow>
                <VoteRow>
                  <h2>YOU HAVE ALREADY VOTED</h2>
                </VoteRow>
                <VoteLink href={`/${pollid}/r`}>RESULTS</VoteLink>
              </PollRows>
            </PollContainer>
          )}
          <ShareContainer>
            <ShareRow>
              <h2>SHARE THIS POLL</h2>
            </ShareRow>
            <ShareRow>
              {currentPoll && (
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

export default PollVoter;
