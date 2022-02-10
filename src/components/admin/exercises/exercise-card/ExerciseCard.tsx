import React, { useState } from 'react';
import { CollectionNames, Exercise } from '../../../models/models';
import { Link } from 'react-router-dom';
import DeleteButton from '../../general/delete-button/DeleteButton';
import firebase from '../../../../config/firebaseConfig';
import './ExerciseCard.scss';

interface GroupCardProps {
  number: number,
  exercise: Exercise,
  subcategoryId: string,
  groupId: string,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>,
}

const ExerciseCard = ({ number, exercise, subcategoryId, groupId, setSuccessMessage }: GroupCardProps): JSX.Element => {
  const [deleting, setDeleting] = useState<boolean>(false);
  const exercisesCollection = firebase.firestore().collection(CollectionNames.Subcategories).doc(subcategoryId)
    .collection(CollectionNames.Groups).doc(groupId).collection(CollectionNames.Exercises);

  const deleteGroup = (): void => {
    setDeleting(true);
    exercisesCollection.doc(exercise.id).delete().then((): void => {
      setSuccessMessage(`Exercise ${number} has been deleted, other exercises have been renamed accordingly.`);
    }).catch((error: {message: string}) => {
      setSuccessMessage(error.message);
    });
  }

  return (
    <div className="exercise-card">
      <h3 className="exercise-card__heading">Exercise { number }</h3>
      <Link to={`/admin-dashboard/exercise/${subcategoryId}/${groupId}/${exercise.id}`} className="exercise-card__edit-button">
        View/Edit
      </Link>
      <DeleteButton disabled={deleting} deleteFunction={deleteGroup} text="Delete" />
    </div>
  )
}

export default ExerciseCard;
