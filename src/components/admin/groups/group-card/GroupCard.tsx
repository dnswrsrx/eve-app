import React, { useState, useEffect } from 'react';
import { Flipped } from "react-flip-toolkit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { CollectionNames, Group } from '../../../models/models';
import { Link } from 'react-router-dom';
import DeleteButton from '../../general/delete-button/DeleteButton';
import firebase from '../../../../config/firebaseConfig';
import './GroupCard.scss';

interface GroupCardProps {
  group: Group,
  number: number,
  subcategoryId: string,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>,
}

const GroupCard = ({ group, number, subcategoryId, setSuccessMessage }: GroupCardProps): JSX.Element => {


  const subcategory = firebase.firestore().collection(CollectionNames.Subcategories).doc(subcategoryId);
  const groupsCollection = subcategory.collection(CollectionNames.Groups);

  useEffect(() => {
    if (group.number !== number) {
      groupsCollection.doc(group.id).update({ number: number }).then()
    }
  }, [number])

  const updateNumberFree = () => {
    groupsCollection.onSnapshot(observer => {
      subcategory.update({ numberOfFreeGroups: (observer.docs.filter(g => (g.get('free'))).length) });
    })
  }

  const [free, setFree] = useState<boolean>(Boolean(group.free));
  const toggleFree = () => {
    groupsCollection.doc(group.id).update({free: !free}).then(() => setFree(!free));
    updateNumberFree();
  }

  const [deleting, setDeleting] = useState<boolean>(false);
  const deleteGroup = (): void => {
    setDeleting(true);
    groupsCollection.doc(group.id).delete().then((): void => {
      setSuccessMessage(`Group ${group.number} has been deleted, other groups have been renamed accordingly.`);
      updateNumberFree();
    }).catch((error: {message: string}) => {
      setSuccessMessage(error.message);
    });
  }

  const renderWords = (): JSX.Element[] => {
    const wordList = Object.keys(group.words).sort();

    return wordList.map(( word: string ): JSX.Element => (
      <li key={word}>{word}</li>
    ));
  }

  return (
    <Flipped
      flipId={`group-${group.number}`}
      stagger="card"
    >
      <div className="group-card">
        <Flipped inverseFlipId={`group-${group.number}`}>
          <div className="group-card__content">
            <h3 className="group-card__heading">Group { group.number }</h3>
            <h4 className="group-card__heading">Word List:</h4>
            <div className="group-card__word-list">
              {
               Object.keys(group.words).length
                 ? <ul className="group-card__word-list">{ renderWords() }</ul>
                 : <p>No words have been added to this group yet.</p>
              }
            </div>
            <div className="group-card__button-container">
              <button className="group-card__free-button" onClick={toggleFree}>
                <FontAwesomeIcon icon={free ? faCheck : faTimes} />
                Free
              </button>
              <Link to={`/admin-dashboard/group/${subcategoryId}/${group.id}`} className="group-card__edit-button">
                Edit
              </Link>
              <DeleteButton disabled={deleting} deleteFunction={deleteGroup} text="Delete" />
            </div>
          </div>
        </Flipped>
      </div>
    </Flipped>
  )
}

export default GroupCard;
