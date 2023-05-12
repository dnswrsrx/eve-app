import React from 'react';
import { Exercise } from '../../models/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './Exercises.scss';

interface ExercisesProps {
  exercises: Exercise[],
  subcategoryId: string,
  groupId: string|null,
}

const Exercises = ({ exercises, subcategoryId, groupId }: ExercisesProps ): JSX.Element => {
  return (
    <div className="exercise-list-main">
      <h2 className="exercise-list-main__heading">{groupId ? 'Exercises' : 'Tests'}</h2>
      <ul className="exercise-list-main__list">
        {
          exercises.map((exercise: Exercise): JSX.Element => (
            <li key={exercise.id}>
              <a
                href={groupId ? `/exercise/${subcategoryId}/${groupId}/${exercise.id}` : `/test/${subcategoryId}/${exercise.id}`}
                className="exercise-list-main__link"
              >
                <span>{groupId ? 'Exercise' : 'Test'} { exercise.number }</span> <FontAwesomeIcon icon={faArrowRight} />
              </a>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Exercises;
