import styled from 'styled-components';
import { TextareaHeightProps } from '../../interfaces';

export const TextareaWrapper = styled.div`
  width: 100%;
  min-height: ${({ wrapperHeight }: TextareaHeightProps) => wrapperHeight};
`;

export const Textarea = styled.textarea`
  width: 100%;
  height: ${({ textareaHeight }: TextareaHeightProps) => textareaHeight};
  padding: 2vmin;

  font-size: 1.8em;
  resize: none;
  display: block;
  overflow: hidden;
  appearance: none;
  border: 0;
  background-color: transparent;
`;
