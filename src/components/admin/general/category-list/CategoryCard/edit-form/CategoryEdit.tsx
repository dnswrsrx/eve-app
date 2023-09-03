import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CategoryTypes, CategoryClickFunction, PageTypes } from '../../../../../models/models';
import { getCollectionName } from '../../../../../../utils/utils';
import firebase from '../../../../../../config/firebaseConfig';
import './CategoryEdit.scss';

interface CategoryEditProps {
  type: CategoryTypes | PageTypes,
  categoryId: string,
  categoryName: string,
  categoryClicked: CategoryClickFunction,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>,
  uniqueIdentifiers?: string[],
}

const CategoryEdit = ({ type, categoryId, categoryName, categoryClicked, setSuccessMessage, uniqueIdentifiers } : CategoryEditProps): JSX.Element => {
  const [updateError, setUpdateError] = useState('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [cancelRef, setCancelRef] = useState<HTMLButtonElement | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const collectionName = getCollectionName(type);
  const categoriesCollection = firebase.firestore().collection(collectionName);

  const onSubmit = (data: any) : void => {
    if(categoryName !== data.name) {
      setSubmitting(true);
      let updatedFields;

      if(type === CategoryTypes.Page) {
        const newSlug = data.name.trim().replaceAll(' ', '-').toLowerCase();
        if(uniqueIdentifiers?.indexOf(newSlug) !== -1) {
          setSubmitting(false);
          setUpdateError('A page with this title already exists.');
          setSuccessMessage('');
          return;
        }
        updatedFields = { name: data.name, slug: newSlug };
      }
      else {
        updatedFields = { name: data.name };
      }

      categoriesCollection.doc(categoryId).update(updatedFields).then((): void => {
        setSuccessMessage(`Renamed to ${data.name}`);
        setSubmitting(false);
        cancelRef?.click();
      }).catch((error: {message: string}) => {
        setSuccessMessage('');
        setUpdateError(error.message);
        setSubmitting(false);
      });
    }
    else {
      setSuccessMessage('');
      cancelRef?.click();
    }
  }

  return (
    <form className="category-edit" onSubmit={handleSubmit(onSubmit)}>
      <div className="category-edit__form-row">
        <label htmlFor="name">Rename: </label>
        <input
          id="name"
          className={`category-edit__field ${errors.name ? 'error' : ''}`}
          type="text"
          defaultValue={categoryName}
          {...register("name", { required: 'Please enter a new name.' })}
        />
      </div>
      <div className="category-edit__submit-options">
        <button
          type="submit"
          className="category-edit__save-option"
          title="Save"
          disabled={submitting}
        >
          <FontAwesomeIcon icon={faSave} />
        </button>
        <button
          type="button"
          className="category-edit__cancel-option"
          title="Cancel"
          disabled={submitting}
          onClick={() => categoryClicked(categoryId)}
          ref={setCancelRef}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      { errors.name?.message && <p className="category-edit__error error">{ errors.name.message.toString() }</p> }
      { updateError && <p className="category-edit__error error">{ updateError }</p> }
    </form>
  )
}

export default CategoryEdit;
