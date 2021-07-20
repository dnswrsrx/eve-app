import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { QuestionList } from '../../../models/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGrinBeam, faFrownOpen, faMeh } from '@fortawesome/free-regular-svg-icons';
import { shuffle } from 'lodash';
import './ExerciseForm.scss';

interface ExerciseFormProps {
  exerciseId: string,
  questions: QuestionList,
}

const ExerciseForm = ({ exerciseId, questions}: ExerciseFormProps): JSX.Element => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<number | null>(null);
  const [resultArray, setResultArray] = useState<(boolean|undefined)[]>([]);
  const options = useRef<JSX.Element[]>(
    shuffle(Array.from(new Set(questions.map(({ answer }) => answer))))
      .map((a: string, index: number) => <option key={index} value={a}>{a}</option>)
  );
  const { register, handleSubmit, errors, reset } = useForm();

  const onSubmit = (data: any) : void => {
    setSubmitting(true);
    const newResultArray: (boolean|undefined)[] = []

    questions.forEach(({ answer }, index: number) => {
      const submittedAnswer = data[`field-${index}`];
      if(submittedAnswer === ''){
        newResultArray[index] = undefined;
      } else if(submittedAnswer === answer) {
        newResultArray[index] = true;
      } else {
        newResultArray[index] = false;
      }
    });

    const correctCounter = newResultArray.filter(i => i).length
    setResult(Math.round(correctCounter * 100 / questions.length));
    setResultArray(newResultArray);
    setSubmitting(false);
  }

  const restartExercise = (): void => {
    setSubmitting(false);
    setResult(null);
    setResultArray([]);
    reset();
  }

  useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [resultArray]);

  const getResultClass = (index: number): string => {
    if(resultArray.length) {
      if(resultArray[index] === undefined){
        return 'unanswered';
      }
      return resultArray[index] ? 'correct' : 'incorrect';
    }
    else {
      return '';
    }
  }

  const getResultMessage = (index: number): JSX.Element => {
    if(resultArray[index]) {

      return (
        <>
          <FontAwesomeIcon icon={faGrinBeam} /> Congratulations, you got the this question correct!
        </>
      )
    }

    if(resultArray[index] === undefined){
        return (
          <>
            <FontAwesomeIcon icon={faMeh} /> Please select an answer.
          </>
        )
      }
    return (
      <>
        <FontAwesomeIcon icon={faFrownOpen} /> Sorry, the answer you chose was incorrect.
      </>
    )
  }

  return (
    <form key={exerciseId} className="exercise-form-main" onSubmit={handleSubmit(onSubmit)}>
      <h2>Questions:</h2>
      { result !== null &&
          <div className="exercise-form-main__result">
            <div className="exercise-form-main__result-image" style={{ backgroundImage: `url(${result > 50 ? '/images/exercise-success.svg' : '/images/exercise-fail.svg'})` }} />
            <div className="exercise-form-main__result-content">
              <p>Your score: <span className={result > 50 ? 'green' : 'red'}>{ result }%</span></p>
              <button type="button" className="exercise-form-main__restart-button" onClick={restartExercise}>
                Restart
              </button>
            </div>
          </div>
      }
      <div className="exercise-form-main__form-body">
        {
          questions.map(({ question }, index: number) => (
            <div key={index} className={`exercise-form-main__form-row ${getResultClass(index)}`}>
              <div className="exercise-form-main__field-container">
                <label htmlFor={`field-${index}`}>{ (index + 1) + '. ' + question }</label>
                <select
                  name={`field-${index}`}
                  id={`field-${index}`}
                  className="exercise-form-main__select-field"
                  defaultValue=""
                  ref={register()}
                >
                  <option value="" disabled>Select a Word</option>
                  { options.current }
                </select>
              </div>
              { errors[`field-${index}`] && <p className="exercise-form-main__error error">{ errors[`field-${index}`].message }</p> }
              {
                resultArray.length
                  ? <p className="exercise-form-main__result-message">{ getResultMessage(index) }</p>
                  : <></>
              }
            </div>
          ))
        }
      </div>
      <div className="exercise-form-main__button-row">
        <button
          type="button"
          className="exercise-form-main__restart-button"
          onClick={restartExercise}
          disabled={submitting}
        >
          Restart
        </button>
        <button
          type="submit"
          className="exercise-form-main__submit"
          disabled={submitting}
        >
          Submit
        </button>
      </div>
    </form>
  )
}

export default ExerciseForm;
