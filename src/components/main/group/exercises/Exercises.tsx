import React from 'react';
import { Exercise } from '../../../models/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './Exercises.scss';

interface ExercisesProps {
  exercises: Exercise[],
  subcategoryId: string,
  groupId: string,
}

const Exercises = ({ exercises, subcategoryId, groupId }: ExercisesProps ): JSX.Element => {
  return (
    <div className="exercise-list-main">
      <h2 className="exercise-list-main__heading">Exercise List</h2>
      <ul className="exercise-list-main__list">
        {
          exercises.map((exercise: Exercise, index: number): JSX.Element => (
            <li key={exercise.id}>
              <a href={`/exercise/${subcategoryId}/${groupId}/${exercise.id}`} className="exercise-list-main__link">
                <span>Exercise { index + 1 }</span> <FontAwesomeIcon icon={faArrowRight} />
              </a>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Exercises;
