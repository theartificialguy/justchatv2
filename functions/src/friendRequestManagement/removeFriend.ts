import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { ProfileDataType } from '../models';

export const removeFriend = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError(
                'failed-precondition',
                'The function must be called while authenticated.',
            );
        }

        const { uid } = context.auth;
        const { profileData }: { profileData: ProfileDataType } = data;

        // deleting my uid and data from his profile
        const promise1 = admin
            .firestore()
            .collection('users')
            .doc(profileData.uid)
            .update({
                friends: admin.firestore.FieldValue.arrayRemove(uid),
            });

        const docData = await admin
            .firestore()
            .collection('users')
            .doc(profileData.uid)
            .collection('friends')
            .where('uid', '==', uid)
            .get();

        const ref = docData.docs[0].ref;
        const promise2 = ref.delete();

        // deleting his uid and data from my profile
        const promise3 = admin
            .firestore()
            .collection('users')
            .doc(uid)
            .update({
                friends: admin.firestore.FieldValue.arrayRemove(
                    profileData.uid,
                ),
            });

        const docData2 = await admin
            .firestore()
            .collection('users')
            .doc(uid)
            .collection('friends')
            .where('uid', '==', profileData.uid)
            .get();
        const ref2 = docData2.docs[0].ref;
        const promise4 = ref2.delete();

        await Promise.all([promise1, promise2, promise3, promise4]);
    } catch (error) {
        throw new functions.https.HttpsError(
            'internal',
            'Something went wrong.',
        );
    }
});
