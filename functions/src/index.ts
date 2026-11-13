import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// import { difference } from 'lodash';
admin.initializeApp();

// When a category is deleted also delete it's subcategories
exports.onCategoryDelete = functions.firestore.document('top-level-categories/{categoryId}').onDelete(async (snap, context) => {
  const categoryId = context.params.categoryId;
  const deletePromises: Promise<FirebaseFirestore.WriteResult>[] = [];

  const subcategories = await admin.firestore().collection('subcategories').where('parent', '==', categoryId).get();
  subcategories.forEach(documentSnapshot => {
    deletePromises.push(documentSnapshot.ref.delete());
  });

  return Promise.all(deletePromises);
});

// When a subcategory is deleted also delete it's groups
exports.onSubcategoryDelete = functions.firestore.document('subcategories/{subcategoryId}').onDelete(async (snap, context) => {
  const subcategoryId = context.params.subcategoryId;
  const deletePromises: Promise<FirebaseFirestore.WriteResult>[] = [];

  const groups = await admin.firestore().collection(`subcategories/${subcategoryId}/groups`).get();
  groups.forEach(documentSnapshot => {
    deletePromises.push(documentSnapshot.ref.delete());
  });

  return Promise.all(deletePromises);
});

// When a group is deleted also delete it's exercises
exports.onGroupDelete = functions.firestore.document('subcategories/{subcategoryId}/groups/{groupId}').onDelete(async (snap, context) => {
  const subcategoryId = context.params.subcategoryId;
  const groupId = context.params.groupId;
  const deletePromises: Promise<FirebaseFirestore.WriteResult>[] = [];

  const exercises = await admin.firestore().collection(`subcategories/${subcategoryId}/groups/${groupId}/exercises`).get();
  exercises.forEach(documentSnapshot => {
    deletePromises.push(documentSnapshot.ref.delete());
  });

  return Promise.all(deletePromises);
});
