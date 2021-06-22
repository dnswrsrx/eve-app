import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DroppableStateSnapshot, DraggableStateSnapshot, DraggableProvided } from "react-beautiful-dnd";
import { Question, QuestionList } from '../../../models/models';
import './ExerciseEdit.scss';

interface ExerciseEditProps {
  questionList: QuestionList,
  setQuestionList: Function,
}

const ExerciseEdit = ({questionList, setQuestionList}: ExerciseEditProps): JSX.Element => {

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = Array.from(questionList);
    const [removed] = reordered.splice(result.destination.index, 1);
    reordered.splice(result.source.index, 0, removed);

    setQuestionList(reordered);
  };

  const updateQuestionList = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const newList = questionList.map(exerciseObj => Object.assign({}, exerciseObj));
    const [field, index]: string[] = e.target.id.split('-');

    if (field && index){
      const exerciseObj = newList[parseInt(index)];
      const newValue = e.target.value;

      if (field === 'answer') {
        exerciseObj.answer = newValue;
      }

      if (field === 'question') {
        exerciseObj.question = newValue;
      }

      setQuestionList(newList);
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            className="exercise-content__preview-container"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {
              questionList.map(({answer, question}: Question, index): JSX.Element => (
                <Draggable draggableId={index.toString()} key={index} index={index}>
                  {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                    <div
                      className="exercise-container__form-row"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <label htmlFor={answer}>Answer: </label>
                      <input
                        id={`answer-${index}`}
                        onChange={updateQuestionList}
                        className={"exercise-container__field"}
                        value={answer || "<! No answer provided !>"}
                      />
                      <label htmlFor={`${answer}-answer`}>Question: </label>
                      <textarea
                        id={`question-${index}`}
                        onChange={updateQuestionList}
                        className={"exercise-container__field"}
                        value={question || "<! No question provided !>"}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            }
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default ExerciseEdit;
