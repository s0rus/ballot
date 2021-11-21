export interface Theme {
  background: string;
  dark: string;
  light: string;
}

export interface GlobalStyleProps {
  theme: Theme;
}

export interface TextareaHeightProps {
  wrapperHeight: number | string;
  textareaHeight: number | string;
}

export interface AutoTextareaProps {
  handleContent(arg: string): void;
  value: string;
  placeholderMessage?: string;
}

export interface PollProps {
  optionIndex: number;
  optionValue: string;
  voteCount: number;
}

export interface PollState {
  pollID: string;
  pollTitle: string;
  duplicationCheck: boolean;
  multipleChoice: boolean;
  pollOptions: PollProps[];
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface ChildrenProps {
  children?: React.ReactNode;
}

export interface PollID {
  pollid: string;
}
