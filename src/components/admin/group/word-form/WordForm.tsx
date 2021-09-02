import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { CollectionNames, WordList, Definitions } from '../../../models/models';
import { formatDictionaryResults } from '../../../../utils/utils';
import DeleteButton from '../../general/delete-button/DeleteButton';
import DefinitionBox from './definitions/DefinitionBox';
import firebase from '../../../../config/firebaseConfig';
import './WordForm.scss';
import CustomEditor from '../../general/custom-editor/CustomEditor';

interface WordFormProps {
  word: string,
  setSelectedWord: React.Dispatch<React.SetStateAction<string | null>>,
  wordList: WordList,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>,
  subcategoryId: string,
  groupId: string,
}

const WordForm = ({ word, setSelectedWord, wordList, setSuccessMessage, subcategoryId, groupId }: WordFormProps): JSX.Element => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [definitions, setDefinitions] = useState<Definitions[] | null>(null);

  const customDefinition = useRef<string>(wordList[word]?.customDefinition || '');

  const { register, handleSubmit, errors, getValues, reset, setValue, watch } = useForm();
  const groupCollection = firebase.firestore().collection(CollectionNames.Subcategories).doc(subcategoryId).collection(CollectionNames.Groups).doc(groupId);

  const formWord = watch('word');

  const updateGroupCollection = (newWord: string, wordListCopy: WordList, successMessage: string): void => {
    if (word !== newWord) setSelectedWord(newWord);

    wordListCopy[newWord] = {
      customDefinition: customDefinition.current,
      dictionaryUrl: getValues('dictionary-url'), // get dictionary url value from form
      apiDefinitions: definitions,
    };

    groupCollection.update({ words: wordListCopy }).then((): void => {
      setSuccessMessage(successMessage);
      setSubmitting(false);
    }).catch((error: { message: string }): void => {
      setSuccessMessage('');
      setSubmitError(error.message);
      setSubmitting(false);
    });
  }

  const searchDefinitions = (): void => {
    const formWord = getValues('word');

    if (word && formWord !== word) {
      setSubmitError(`The word entered does not match the word you selected from the list: ${word}`);
      setSuccessMessage('');
      return;
    }

    if(!formWord) {
      setSubmitError('Please enter a word first');
      setSuccessMessage('');
      return;
    }

    setSubmitting(true);
    fetch(`https://api.dictionaryapi.dev/api/v1/entries/en/${formWord}`).then(response => {
      response.json().then((data: any) => {
        setSubmitError('');
        setSuccessMessage('');
        if(data.length) {
          reset({
            word: getValues('word'),
            'custom-definition': customDefinition.current,
            'dictionary-url': getValues('dictionary-url'),
          });
          setDefinitions(formatDictionaryResults(data));
        }
        else {
          if(data?.title?.toLowerCase() === 'no definitions found') {
            setSubmitError('No definitions found for the entered word');
          }
        }
      }).catch(error => {
        setSubmitError('Something went wrong while trying to process data, please try again');
        console.log(error);
      });
    }).catch(error => {
      setSubmitError('Something went wrong, please try again');
      console.log(error);
    }).finally(() => setSubmitting(false));
  }

  const onSubmit = (data: any) : void => {
    setSubmitting(true);
    setSubmitError('');
    const wordListCopy = { ...wordList }
    const newWord = data.word.trim();

    // Updating an existing word
    if(word === newWord) {
      updateGroupCollection(newWord, wordListCopy, `Updated word: ${newWord}`);
    }
    else {
      // If new word already exists
      if(wordListCopy[newWord]) {
        setSuccessMessage('');
        setSubmitError('That word already exists in this list.');
        setSubmitting(false);
        return;
      }

      // Replacing an existing word
      if(word && word !== newWord) {
        delete wordListCopy[word];
        updateGroupCollection(newWord, wordListCopy, `${word} removed, ${newWord} added`);
      }
      // Adding a completely new word
      else {
        updateGroupCollection(newWord, wordListCopy, `Added new word: ${newWord}`);
      }
    }
  }

  const deleteWord = () => {
    if(word) {
      setSubmitting(true);
      const wordListCopy = { ...wordList }
      delete wordListCopy[word];
      groupCollection.update({ words: wordListCopy }).then((): void => {
        setSuccessMessage(`Word deleted: ${word}`);
        setSubmitting(false);
        setSelectedWord(null);
      }).catch((error: { message: string }): void => {
        setSuccessMessage('');
        setSubmitError(error.message);
        setSubmitting(false);
      });
    }
  }

  const clearDefinitions = () => setDefinitions(null);

  useEffect(() => {
    setValue('word', word);
    if(wordList[word]) {
      const _word = wordList[word];
      setDefinitions(_word?.apiDefinitions || null);
      customDefinition.current = _word?.customDefinition || '';
    }
    else {
      setDefinitions(null);
      customDefinition.current = '';
    }
    setSuccessMessage('');
    setSubmitError('');
  }, [word, wordList, setValue]);

  return (
    <form key={word} className="word-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="word-form__close-container">
        <button type="button" disabled={!definitions && submitting} onClick={() => {setSelectedWord(null)}}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="word-form__field-row">
        <label htmlFor="word">Word: </label>
        <input
          id="word"
          name="word"
          className={`word-form__field ${errors.word ? 'error' : ''}`}
          type="text"
          ref={register({ required: 'Please enter a word.' })}
          defaultValue={word}
        />
      </div>
      { errors.word && <p className="word-form__error error">{ errors.word.message }</p> }
      { submitError && <p className="category-edit__error error">{ submitError }</p> }
      <div className="word-form__field-row">
        <label htmlFor="custom-definition">Custom Definition: </label>
        <CustomEditor contentReference={customDefinition} height={250} />
      </div>
      <div className="word-form__field-row">
        <label htmlFor="dictionary-url">Dictionary URL: </label>
        <input
          id="dictionary-url"
          name="dictionary-url"
          className={`word-form__field ${errors['dictionary-url'] ? 'error' : ''}`}
          type="text"
          ref={register()}
          defaultValue={wordList[word] && wordList[word].dictionaryUrl}
        />
      </div>

      <div className="word-form__submit-row">
        <button disabled={!formWord || (word && word !== formWord) || submitting} className="word-form__def-button" type="button" onClick={searchDefinitions}>
          Get Definitions
        </button>
        { definitions && definitions.length &&
          <button className="word-form__clear-definitions" disabled={submitting} onClick={clearDefinitions}>
            Clear Definitions
          </button>
        }
        <button disabled={!formWord || submitting} className="word-form__save-button" type="submit">
          { word ? (word !== formWord ? 'Change Word' : 'Save') : 'Add' }
        </button>
        { word && <DeleteButton disabled={!formWord || submitting} deleteFunction={deleteWord} text="Delete" /> }
      </div>

      { definitions && definitions.length &&
        <>
          <DefinitionBox definitions={definitions} setDefinitions={setDefinitions} />
          <div className="word-form__submit-row">
            <button disabled={!formWord || submitting} className="word-form__save-button" type="submit">
              { word ? (word !== formWord ? 'Change Word' : 'Save') : 'Add' }
            </button>
            { definitions && definitions.length &&
              <button className="word-form__clear-definitions" disabled={submitting} onClick={clearDefinitions}>
                Clear Definitions
              </button>
            }
            { word && <DeleteButton disabled={!formWord || submitting} deleteFunction={deleteWord} text="Delete" /> }
          </div>
        </>
      }

    </form>
  )
}

export default WordForm;
