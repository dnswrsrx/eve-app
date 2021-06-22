import React, { useState } from 'react';
import { CollectionNames, Exercise, QuestionList, Question } from '../../../models/models';
import firebase from '../../../../config/firebaseConfig';
import './ExerciseForm.scss';
import ExerciseEdit from './ExerciseEdit'

interface ExerciseFormProps {
  exercise: Exercise,
  subcategoryId: string,
  groupId: string,
  exerciseId: string
}

// Function to parse individual row into a Question object
const parseRow = (row: Element, answerMap: Map<string, string>): Question => {
  const questionElement = row.querySelector('.LeftItem');
  const answerElement = row.querySelector('.RightItem select');
  let questionId = answerElement ? answerElement.id : '';
  questionId = questionId.substring(questionId.indexOf('_') + 1, questionId.length);
  const fullQuestion = questionElement?.textContent;
  const trimmedQuestion = fullQuestion?.substring((parseInt(questionId) + 1).toString().length + 2, fullQuestion.length);

  const answer: string = answerMap.get(questionId) || '';

  return { answer: answer, question: trimmedQuestion }
}

// Function to generate answerMap
// answerMap passed in to parseRow
// Worth skipping the useRef perhaps?
const makeAnswerMap = (questionRows: NodeListOf<Element>): Map<string, string> => {
  const answerMap = new Map<string, string>();
  const possibleAnswers = questionRows[0].querySelector('.RightItem select')?.querySelectorAll('option');

  possibleAnswers?.forEach((answer: HTMLOptionElement): void => {
    answerMap.set(answer.value, answer.innerHTML)
  })

  return answerMap;
}

const ExerciseForm = ({ exercise, subcategoryId, groupId, exerciseId }: ExerciseFormProps): JSX.Element => {
  const [questionList, setQuestionList] = useState<QuestionList>(exercise.questions);
  const [currentUpload, setCurrentUpload] = useState<string>('No file uploaded yet');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const exerciseCollection = firebase.firestore().collection(CollectionNames.Subcategories).doc(subcategoryId)
    .collection(CollectionNames.Groups).doc(groupId).collection(CollectionNames.Exercises).doc(exerciseId);

  const saveExercise = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();

    setSuccessMessage('');
    setSubmitError('');
    setSubmitting(true);

    if(!Object.keys(questionList).length) {
      setSubmitError('Save Failed. The exercise is empty.');
      setSubmitting(false);
      return;
    }

    exerciseCollection.update({ questions: questionList }).then((): void => {
      setSuccessMessage('Exercise has been saved.');
      setCurrentUpload('No file uploaded yet');
    }).catch((error: { message: string }): void => {
      setSuccessMessage('');
      setSubmitError(error.message);
    });

    setSubmitting(false);
  }

  const parseFile = (e: React.ChangeEvent<HTMLInputElement>): void => {

    // Reset messages and question list
    // prior to parsing uploaded HTM
    setSubmitError('');
    setSuccessMessage('');
    setQuestionList(exercise.questions);

    const file = e.target.files ? e.target.files[0] : null;

    // Start parsing the uploaded file.
    // Update the current file name to be displayed.
    // Early error if parsing failed.
    // Update questionList state.
    if (file) {

      setCurrentUpload(file.name);

      (file as any).text().then((res: string) => {
        const exerciseHtml = document.createElement("html");
        exerciseHtml.innerHTML = res;

        let questionRows = exerciseHtml.querySelectorAll('#Questions tr');

        // Later HTM exports use MatchItems instead of Questions
        // for the ID of the tbody containing the exercises.
        if (!questionRows.length) {
          questionRows = exerciseHtml.querySelectorAll('#MatchItems tr');
        }

        if(!questionRows.length) {
          setSuccessMessage('');
          setSubmitError('Error parsing file. Please ensure you uploaded the correct file.');
          return;
        }

        const answerMap = makeAnswerMap(questionRows);

        setQuestionList(
          Array.from(questionRows).filter((row: Element): boolean => {
            let newRow = parseRow(row, answerMap);
            return Boolean(newRow?.question?.length);
          }).map((row: Element): Question => {
            return parseRow(row, answerMap);
          })
        );
      })
    } else {
      setSubmitError('No files found. Please ensure a file is uploaded.')
    }
  }

  return (
    <div className="exercise-content">
      <div className="exercise-content__form-container">

        <div className="exercise-content__form">
          <h2>Upload Form</h2>
          <p>{ currentUpload }</p>

          <input className="hidden" type="file" id="exercise-file" name="exercise-file" disabled={submitting} onChange={parseFile} />

          <div className="exercise-content__button-container">
            <label className="exercise-content__upload-button" htmlFor="exercise-file">Upload an Exported HTM</label>
            <button
              className="exercise-content__save-button"
              type="submit"
              disabled={submitting}
              onClick={saveExercise}
            >
              Save Exercise
            </button>
          </div>
        </div>

        { successMessage && <h3 className="exercise-content__success success">{ successMessage }</h3> }
        { submitError && <h3 className="exercise-content__error error">{ submitError }</h3> }

          <h2>Preview</h2>
          {
            Object.keys(questionList).length
              ? <ExerciseEdit
                questionList={questionList}
                setQuestionList={setQuestionList}
              />
              : <p>This exercise is currently empty.</p>
          }
        </div>

      </div>
    </div>
  )
}

export default ExerciseForm;
