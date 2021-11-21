import React, { useState } from 'react';
import {
  PollContainer,
  PollRows,
  PollRow,
  PollOptions,
  PollOption,
  Checkbox,
  PollButton,
} from '../../utils/PollElements';
import AutoTextarea from '../AutoTextarea/AutoTextarea';
import { PollState } from '../../interfaces';
import { firestore, timestamp } from '../../firebase/config';
import { customAlphabet } from 'nanoid';
import { useHistory } from 'react-router-dom';

const initialPollState: PollState = {
  pollID: '',
  pollTitle: '',
  duplicationCheck: false,
  multipleChoice: false,
  pollOptions: [
    {
      optionIndex: 0,
      optionValue: '',
      voteCount: 0,
    },
    {
      optionIndex: 1,
      optionValue: '',
      voteCount: 0,
    },
  ],
  createdAt: {
    seconds: 0,
    nanoseconds: 0,
  },
};

const PollCreator: React.FC = () => {
  const [pollData, setPollData] = useState(initialPollState);
  const [isTitleEmpty, setIsTitleEmpty] = useState(true);
  const [areOptionsEmpty, setAreOptionsEmpty] = useState(true);
  const history = useHistory();

  const handleNewPoll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nanoid = customAlphabet('1234567890', 10);
    const pollID = nanoid();
    const { pollTitle, duplicationCheck, multipleChoice, pollOptions } = pollData;
    const newPollDataOptions = pollOptions.filter((option) => option.optionValue);

    if (!pollData.pollTitle) setIsTitleEmpty(true);
    if (newPollDataOptions.length < 2) setAreOptionsEmpty(true);
    if (!pollData.pollTitle || newPollDataOptions.length < 2) return;

    await firestore
      .collection('POLLS')
      .doc(`${pollID}`)
      .set({
        pollID,
        pollTitle,
        duplicationCheck,
        multipleChoice,
        pollOptions: newPollDataOptions,
        createdAt: timestamp(),
      })
      .then(() => history.push(`/${pollID}`));
  };

  const handleDuplication = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPollData({
      ...pollData,
      duplicationCheck: !pollData.duplicationCheck,
    });
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPollData({
      ...pollData,
      multipleChoice: !pollData.multipleChoice,
    });
  };

  const handleTitle = (newTitle: string) => {
    setPollData({
      ...pollData,
      pollTitle: newTitle,
    });

    newTitle ? setIsTitleEmpty(false) : setIsTitleEmpty(true);
  };

  const handlePollOption = (newPollOption: string, index: number) => {
    let arrCopy = pollData.pollOptions.slice();
    arrCopy[index] = {
      optionIndex: index,
      optionValue: newPollOption,
      voteCount: 0,
    };

    let oldPollDataOptionsCount = pollData.pollOptions.length;
    let newPollDataOptions = arrCopy.filter((option) => option.optionValue);

    setPollData({
      ...pollData,
      pollOptions: arrCopy,
    });

    newPollDataOptions.length >= 2 ? setAreOptionsEmpty(false) : setAreOptionsEmpty(true);

    if (index === oldPollDataOptionsCount - 1 && oldPollDataOptionsCount < 30) {
      arrCopy.push({
        optionIndex: index,
        optionValue: '',
        voteCount: 0,
      });

      setPollData({
        ...pollData,
        pollOptions: arrCopy,
      });
    }
  };

  return (
    <PollContainer>
      <form onSubmit={handleNewPoll}>
        <PollRows>
          <PollRow>
            <AutoTextarea
              handleContent={(e: string) => handleTitle(e)}
              value={pollData.pollTitle}
              placeholderMessage='Type question of the poll here'
            />
            {isTitleEmpty && <h2>TITLE IS REQUIRED</h2>}
          </PollRow>
          {pollData.pollOptions.map((pollOption, index, arr) => (
            <PollRow key={index}>
              <AutoTextarea
                handleContent={(content: string) => handlePollOption(content, index)}
                value={pollOption.optionValue}
                placeholderMessage='Type poll option here'
              />
              {areOptionsEmpty && arr.length - 1 === index && <h2>AT LEAST 2 OPTIONS ARE REQUIRED</h2>}
            </PollRow>
          ))}
        </PollRows>
        <PollOptions>
          <PollOption>
            <Checkbox type='checkbox' checked={pollData.duplicationCheck} onChange={handleDuplication} />
            <span>CHECK FOR DUPLICATION</span>
          </PollOption>
          <PollOption>
            <Checkbox type='checkbox' checked={pollData.multipleChoice} onChange={handleCheckbox} />
            <span>ALLOW MULTIPLE CHOICE</span>
          </PollOption>
          <PollButton disabled={isTitleEmpty || areOptionsEmpty}>CREATE POLL</PollButton>
        </PollOptions>
      </form>
    </PollContainer>
  );
};

export default PollCreator;
