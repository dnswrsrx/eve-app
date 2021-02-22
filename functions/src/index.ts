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

// exports.onGroupUpdate = functions.firestore.document('subcategories/{subcategoryId}/groups/{groupId}').onUpdate(async (change, context) => {
//   const subcategoryId = context.params.subcategoryId;
//   const groupId = context.params.groupId;
//   const oldWords = Object.keys(change.before.data().words);
//   const newWords = Object.keys(change.after.data().words);
//   const deletedWords = difference(oldWords, newWords);
//   const updatePromises: Promise<FirebaseFirestore.WriteResult>[] = [];

//   if(deletedWords.length) {
//     const exercises = await admin.firestore().collection('subcategories').doc(subcategoryId).collection('groups').doc(groupId).collection('exercises').get();
//     exercises.forEach(documentSnapshot => {
//       const exerciseQuestions = documentSnapshot.data().questions;
//       deletedWords.forEach((word: string) => {
//         delete exerciseQuestions[word];
//       })
//       updatePromises.push(documentSnapshot.ref.update({ questions: exerciseQuestions }));
//     });
//   }

//   return Promise.all(updatePromises);
// });

exports.onSubscriptionWrite = functions.firestore.document('users/{userID}/subscriptions/{subscriptionID}').onWrite(
  async (snap, context) => {

    const userID = context.params.userID;
    const subscription = snap.after.data();

    if (subscription) {

      const userDoc = await admin.firestore().collection('users').doc(userID).get();

      if (userDoc) {
        if (subscription.status === 'canceled') {
          return Promise.resolve(userDoc.ref.update({ main: admin.firestore.FieldValue.delete() }));
        } else {
          if (['General Vocabulary', 'General Vocabulary and Academic Writing'].includes(subscription.metadata.subscription)) {
            return Promise.resolve(userDoc.ref.update({ main: subscription.metadata.subscription }));
          }
        }
      }
    }
    return null;
  })
