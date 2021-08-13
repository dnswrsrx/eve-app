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

  const { register, handleSubmit, errors, getValues, reset, setValue } = useForm();
  const groupCollection = firebase.firestore().collection(CollectionNames.Subcategories).doc(subcategoryId).collection(CollectionNames.Groups).doc(groupId);

  const updateGroupCollection = (data: any, newWord: string, wordListCopy: WordList, successMessage: string): void => {
    wordListCopy[newWord] = {
      customDefinition: customDefinition.current,
      dictionaryUrl: data['dictionary-url'],
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
    const wordListCopy = { ...wordList }
    const newWord = data.word.trim();

    // Updating an existing word
    if(word === newWord) {
      updateGroupCollection(data, newWord, wordListCopy, `Updated word: ${newWord}`);
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
        updateGroupCollection(data, newWord, wordListCopy, `${word} removed, ${newWord} added`);
      }
      // Adding a completely new word
      else {
        updateGroupCollection(data, newWord, wordListCopy, `Added new word: ${newWord}`);
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
    setSubmitError('');
  }, [word, wordList]);

  return (
    <form key={word} className="word-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="word-form__close-container">
        <button type="button" disabled={!definitions && submitting} onClick={() => {setSelectedWord(null)}}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="word-form__field-row">
        <label htmlFor="name">Word: </label>
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
        <button disabled={submitting} className="word-form__def-button" type="button" onClick={searchDefinitions}>
          Get Definitions
        </button>
        <button disabled={!definitions || submitting} className="word-form__save-button" type="submit">
          { word ? 'Save' : 'Add' }
        </button>
        { word && <DeleteButton disabled={!definitions || submitting} deleteFunction={deleteWord} text="Delete" /> }
      </div>

      { definitions && <DefinitionBox definitions={definitions} setDefinitions={setDefinitions} /> }

      { definitions && definitions.length > 0 &&
        <div className="word-form__submit-row">
          <button disabled={!definitions || submitting} className="word-form__save-button" type="submit">
            { word ? 'Save' : 'Add' }
          </button>
          { word && <DeleteButton disabled={!definitions || submitting} deleteFunction={deleteWord} text="Delete" /> }
        </div>
      }
    </form>
  )
}

export default WordForm;
