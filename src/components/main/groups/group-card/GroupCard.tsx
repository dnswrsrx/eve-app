import React from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import { Group } from '../../../models/models';
import './GroupCard.scss';

interface GroupCardProps {
  subcategoryId: string,
  group: Group,
  notSubscribed: boolean
}

const GroupCard = ({ subcategoryId, group, notSubscribed }: GroupCardProps) => {
  const wordList = Object.keys(group.words).sort();

  const renderWords = (): JSX.Element[] => {
    return wordList.map((word: string): JSX.Element => (
      <li key={word} className="group-card-main__word">{word}</li>
    ));
  }

  const renderCard = (): JSX.Element => {
    return (
      <>
        <div className="group-card-main__card-header">
          <h2 className="group-card-main__heading">
            Group {group.number}
          </h2>
          { notSubscribed && group.free &&
            <h2 className="group-card-main__free"><FontAwesomeIcon icon={faStar} /> Free</h2>
          }
        </div>
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
      {
        notSubscribed && !group.free
          ? <div className="group-card-main">{ renderCard() }</div>
          : <Link to={`/group/${subcategoryId}/${group.id}`} className="group-card-main">{ renderCard() }</Link>
      }
    </li>
  )
}

export default GroupCard;
