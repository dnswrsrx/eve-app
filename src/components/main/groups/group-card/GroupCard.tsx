import React from 'react';
import { Link } from 'react-router-dom';

import { Group } from '../../../models/models';
import './GroupCard.scss';

interface GroupCardProps {
  subcategoryId: string,
  group: Group,
}

const GroupCard = ({ subcategoryId, group }: GroupCardProps) => {
  const wordList = Object.keys(group.words).sort();

  const renderWords = (): JSX.Element[] => {
    return wordList.map((word: string): JSX.Element => (
      <li key={word} className="group-card-main__word">{word}</li>
    ));
  }

  const renderCard = (): JSX.Element => {
    return (
      <>
        <h2 className="group-card-main__heading">
          Group {group.number}
        </h2>
        {
          wordList.length
            ? <ul className="group-card-main__word-list">
                { renderWords() }
              </ul>
            : <p>No words have been added to this list yet.</p>
        }
      </>
    )
  }

  return (
    <li>
      <Link to={`/group/${subcategoryId}/${group.id}`} className="group-card-main">{ renderCard() }</Link>
    </li>
  )
}

export default GroupCard;
