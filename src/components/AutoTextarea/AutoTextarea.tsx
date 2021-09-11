import React, { useState, useEffect, useRef } from 'react';
import { AutoTextareaProps } from '../../interfaces';
import { Textarea, TextareaWrapper } from './AutoTextareaStyles';

const AutoTextarea: React.FC<AutoTextareaProps> = ({ handleContent, value, placeholderMessage }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [wrapperHeight, setWrapperHeight] = useState('auto');
  const [textareaHeight, setTextareaHeight] = useState('auto');

  useEffect(() => {
    setWrapperHeight(`${textareaRef.current!.scrollHeight}px`);
    setTextareaHeight(`${textareaRef.current!.scrollHeight}px`);
  }, [value]);

  const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaHeight('auto');
    setWrapperHeight(`${textareaRef.current!.scrollHeight}px`);
    handleContent(e.target.value);
  };

  return (
    <TextareaWrapper wrapperHeight={wrapperHeight}>
      <Textarea
        ref={textareaRef}
        textareaHeight={textareaHeight}
        rows={1}
        value={value}
        onChange={handleResize}
        placeholder={placeholderMessage}
      />
    </TextareaWrapper>
  );
};

export default AutoTextarea;
