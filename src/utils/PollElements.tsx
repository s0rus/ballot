import styled from 'styled-components';
import { GlobalStyleProps } from '../interfaces';

export const PollContainer = styled.div`
  width: 100%;
  margin: 2vmin;

  @media screen and (min-width: 1024px) {
    width: 60vmin;
  }

  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;

  background-color: #fff;
  border: 2px solid ${({ theme }: GlobalStyleProps) => theme.dark};
  border-radius: 8px;
`;

export const PollRow = styled.div`
  width: 100%;
  padding: 1vmin 2vmin;

  border-bottom: 2px solid ${({ theme }: GlobalStyleProps) => theme.dark};

  &:first-child {
    border-bottom: 4px solid ${({ theme }: GlobalStyleProps) => theme.dark};
    padding: 2vmin;
  }
`;

export const PollRows = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

export const PollOptions = styled.div`
  margin-top: 10vmin;
  width: 100%;

  display: flex;
  flex-flow: column nowrap;
`;

export const PollButton = styled.button`
  padding: 2.5vmin;

  background-color: transparent;
  font-weight: bold;
  border: none;
  border-top: 4px solid ${({ theme }: GlobalStyleProps) => theme.dark};
  font-size: 1.8em;

  cursor: pointer;

  &[disabled] {
    cursor: not-allowed;
  }
`;

export const PollOption = styled.div`
  padding: 2vmin;

  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;

  border-top: 2px solid ${({ theme }: GlobalStyleProps) => theme.dark};

  &:last-child {
    border-bottom: 2px solid ${({ theme }: GlobalStyleProps) => theme.dark};
  }

  select option {
    font-size: 1.8em;
  }

  svg {
    margin-right: 2vmin;
  }

  select {
    flex: 1;
    padding: 1vmin;
  }
`;

export const Checkbox = styled.input`
  width: 24px;
  height: 24px;
  margin-right: 2vmin;
`;

export const VoteButton = styled(PollButton)`
  border-top: 2px solid ${({ theme }: GlobalStyleProps) => theme.dark};
  border-bottom: 2px solid ${({ theme }: GlobalStyleProps) => theme.dark};
`;

export const VoteRow = styled(PollRow)`
  label {
    display: flex;
    align-items: center;
  }

  h1 {
    font-size: 2.4em;
  }

  span {
    font-size: 1.6em;
  }

  h1,
  span {
    word-break: break-word;
  }

  h2 {
    text-align: center;
    padding: 2em;
    font-size: 1.4em;
  }
`;

export const VoteLink = styled.a`
  padding: 2.5vmin;

  text-align: center;
  font-weight: bold;
  border-bottom: 2px solid ${({ theme }: GlobalStyleProps) => theme.dark};
  font-size: 1.8em;
  text-decoration: none;
`;

export const ShareContainer = styled(PollContainer)``;

export const ShareRow = styled(PollRow)`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  border: 0;
  padding: 0 2vmin;

  &:first-child {
    border: 0;
    padding-bottom: 0;
    padding: 2vmin 2vmin 0.5vmin 2vmin;
  }

  &:last-child {
    padding: 1.5vmin 2vmin;
  }

  h2 {
    font-size: 1.6em;
  }

  svg {
    box-sizing: content-box;
    cursor: pointer;
    padding: 1vmin;
    margin-left: 1vmin;
  }

  span {
    font-size: 1.2em;
    position: absolute;
  }
`;

export const ShareInput = styled.input`
  padding: 1vmin 1.5vmin;
  flex: 1;

  font-size: 1.6em;
  position: relative;
`;

interface VotePercentage {
  votePercentage: number;
}

export const ResultRow = styled(VoteRow)`
  padding: 0;
  background-color: ${({ theme }: GlobalStyleProps) => theme.light};

  h2 {
    display: flex;
    justify-content: space-between;

    padding: 0.5vmin 2vmin 0.5vmin 2vmin;
    font-size: 1.2em;
  }
`;

export const PercentageContainer = styled.div`
  display: flex;
  justify-content: space-between;

  div {
    height: 2vh;
    transition: width 0.2s ease-in-out;
    width: ${({ votePercentage }: VotePercentage) => `${votePercentage}%`};
    background-color: ${({ theme }: GlobalStyleProps) => theme.dark};
  }

  span {
    word-break: keep-all;
    margin: 0 1em;
  }
`;

export const StatsRow = styled(VoteRow)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    padding: 0;
  }
`;
