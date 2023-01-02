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
      const promises: Promise<FirebaseFirestore.WriteResult>[] = [];

      const userDoc = await admin.firestore().collection('users').doc(userID).get();

      if (userDoc) {
        const subscriptionItem = subscription.items[0];

        if (subscriptionItem.price.product.name === 'Institutional Pricing') {
          const accessCode = admin.firestore().collection('access-codes').doc(userID);

          const subscribersCollection = accessCode.collection('subscribers');
          const subscribersSnapshot = await subscribersCollection.get();
          const subscribers = subscribersSnapshot.docs
            .map(d => {
              const { email, created, disabled } = d.data();
              return {email, created, disabled, id: d.id};
            })
            .sort((prev, curr) => prev.created.seconds > curr.created.seconds ? 1 : -1);

          const remainingSpots = subscriptionItem.quantity - subscribers.length;

          // Update access code info
          promises.push(accessCode.set({
            quantity: subscriptionItem.quantity,
            remaining: Math.max(0, remainingSpots),
            status: subscription.status,
            ended_at: subscription.ended_at,
            current_period_end: subscription.current_period_end,
          }, { merge: true }))

          // Delete subscribers until number of subscribers matches the number of units user purchased
          if (remainingSpots < 0) {
            const toDelete = subscribers.slice(0, -remainingSpots);
            toDelete.forEach(s => promises.push(subscribersCollection.doc(s.id).delete()));
          }
        }
      }
      return Promise.all(promises)
    }
    return;
  })
