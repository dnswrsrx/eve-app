import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CollectionNames, Exercise } from '../../../models/models';
import firebase from '../../../../config/firebaseConfig';

interface ExerciseAddProps {
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>,
  subcategoryId: string,
  groupId: string|null,
  number: number,
}

const ExerciseAdd = ({ setSuccessMessage, subcategoryId, groupId, number }: ExerciseAddProps): JSX.Element => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [addError, setAddError] = useState<string>('');

  const subcategory = firebase.firestore().collection(CollectionNames.Subcategories).doc(subcategoryId);
  const exercisesCollection = groupId
    ? subcategory.collection(CollectionNames.Groups).doc(groupId).collection(CollectionNames.Exercises)
    : subcategory.collection(CollectionNames.Tests);


  const history = useNavigate();

  const addExercise = (): void => {
    setSubmitting(true);

    const newDocument: Exercise = {
      questions: [],
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      number: number,
    }

    exercisesCollection.add(newDocument).then((newExerciseRef): void => {
      setSubmitting(false);
      setAddError('');
      setSuccessMessage('New exercise added');
      history(
        groupId
        ? `/admin-dashboard/exercise/${subcategoryId}/${groupId}/${newExerciseRef.id}`
        : `/admin-dashboard/test/${subcategoryId}/${newExerciseRef.id}`
      );
    }).catch((error: {message: string}) => {
      setSubmitting(false);
      setAddError(error.message);
      setSuccessMessage('');
    });
  }

  return (
    <div className="exercise-add">
      <div className="exercise-add__button-container">
        <button className="group-add__add-button" onClick={addExercise} disabled={submitting}>
          Add a New {groupId ? 'Exercise' : 'Test'}
        </button>
      </div>
      { !addError && <p className="group-add__error error">{ addError }</p> }
    </div>
  )
}

export default ExerciseAdd;
