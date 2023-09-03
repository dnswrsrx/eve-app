import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CategoryTypes, CategoryDocument } from '../../../models/models';
import firebase from '../../../../config/firebaseConfig';
import { getCollectionName } from '../../../../utils/utils';
import './CategoryAdd.scss';

interface CategoryAddProps {
  type: CategoryTypes,
  successMessage: string,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>,
  parentId?: string,
  uniqueIdentifiers?: string[],
}

const CategoryAdd = ({ type, successMessage, setSuccessMessage, parentId, uniqueIdentifiers }: CategoryAddProps): JSX.Element => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [addError, setAddError] = useState<string>('');
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const collectionName = getCollectionName(type);
  const categoriesCollection = firebase.firestore().collection(collectionName);

  const onSubmit = (data: any) : void => {
    setSubmitting(true);

    const newDocument: CategoryDocument = {
      name: data.name,
      createdAt: new Date(),
    };

    if(type === CategoryTypes.Sub) newDocument.parent = parentId;
    else if(type === CategoryTypes.Lang) {
      newDocument.bannerHeading = '';
      newDocument.bannerText = '';
      newDocument.mainContent = '';
    }
    else if(type === CategoryTypes.Page) {
      const newSlug = data.name.trim().replaceAll(' ', '-').toLowerCase();
      if(uniqueIdentifiers?.indexOf(newSlug) !== -1) {
        setSubmitting(false);
        setAddError('A page with this title already exists.');
        setSuccessMessage('');
        return;
      }
      newDocument.slug = newSlug;
    }

    categoriesCollection.doc().set(newDocument).then((): void => {
      setSubmitting(false);
      setAddError('');
      setSuccessMessage(`${data.name} successfully added`);
      reset();
    }).catch((error: {message: string}) => {
      setSubmitting(false);
      setAddError(error.message);
      setSuccessMessage('');
    });
  }

  return (
    <form className="category-add" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="category-add__heading">Add a New {type}</h2>
      <div className="category-add__form-content">
        <div className="category-add__field-row">
          <label htmlFor="name">Name: </label>
          <input
            id="name"
            className={`category-add__field ${errors.name ? 'error' : ''}`}
            type="text"
            {...register("name", { required: 'Please enter a name.' })}
          />
        </div>
        <div className="category-add__submit-row">
          { submitting && <span className="category-add__spinner" aria-hidden="true"></span> }
          <button className="category-add__submit" type="submit" disabled={submitting}>Add</button>
        </div>
      </div>
      { errors.name?.message && <p className="category-add__error error">{ errors.name.message.toString() }</p> }
      { successMessage && <p className="category-add__success success">{ successMessage }</p> }
      { addError && <p className="category-add__error error">{ addError }</p> }
    </form>
  )
}

export default CategoryAdd;
