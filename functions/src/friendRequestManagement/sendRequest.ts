import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { ProfileDataType } from '../models';

export const sendRequest = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError(
                'failed-precondition',
                'The function must be called while authenticated.',
            );
        }

        const { uid } = context.auth;
        const {
            profileData,
            myProfileData,
        }: { profileData: ProfileDataType; myProfileData: ProfileDataType } =
            data;

        const promise1 = admin
            .firestore()
            .collection('users')
            .doc(profileData.uid)
            .update({
                friendRequests: admin.firestore.FieldValue.arrayUnion(uid),
            });

        const promise2 = admin
            .firestore()
            .collection('users')
            .doc(profileData.uid)
            .collection('friendRequests')
            .add(myProfileData);

        await Promise.all([promise1, promise2]);
    } catch (error) {
        throw new functions.https.HttpsError(
            'internal',
            'Something went wrong.',
        );
    }
});
