import React, { useState } from 'react';
import { WordList as WordListInterface } from '../../../models/models';
import WordButton from '../word-button/WordButton';
import WordForm from '../word-form/WordForm';
import './WordList.scss';

interface WordListProps {
  words: WordListInterface,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>,
  subcategoryId: string,
  groupId: string,
}

const WordList = ({ words, setSuccessMessage, subcategoryId, groupId }: WordListProps): JSX.Element => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const wordList = [...Object.keys(words).sort(), ''];

  const renderWordList = (): JSX.Element[] => {
    return wordList.map((word: string, index: number): JSX.Element => (
      <li key={index}>
        <WordButton
          word={word}
          selectedWord={selectedWord}
          setSelectedWord={setSelectedWord}
        />
      </li>
    ));
  }

  return (
    <div className="word-list">
      <h2 className="word-list__heading">Word List</h2>
      <ul className="word-list__list">
        { renderWordList() }
      </ul>
      {
        selectedWord !== null &&
          <WordForm
            word={selectedWord}
            setSelectedWord={setSelectedWord}
            wordList={words}
            setSuccessMessage={setSuccessMessage}
            subcategoryId={subcategoryId}
            groupId={groupId}
          />
      }
    </div>
  )
}

export default WordList;
