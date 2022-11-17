import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { ProfileDataType } from '../models';

export const cancelRequest = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError(
                'failed-precondition',
                'The function must be called while authenticated.',
            );
        }

        const { uid } = context.auth;
        const { profileData }: { profileData: ProfileDataType } = data;

        const promise1 = admin
            .firestore()
            .collection('users')
            .doc(profileData.uid)
            .update({
                friendRequests: admin.firestore.FieldValue.arrayRemove(uid),
            });

        const docData = await admin
            .firestore()
            .collection('users')
            .doc(profileData.uid)
            .collection('friendRequests')
            .where('uid', '==', uid)
            .get();

        const ref = docData.docs[0].ref;
        const promise2 = ref.delete();

        await Promise.all([promise1, promise2]);
    } catch (error) {
        throw new functions.https.HttpsError(
            'internal',
            'Something went wrong.',
        );
    }
});
