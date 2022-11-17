import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { ProfileDataType } from '../models';

export const rejectFriendRequest = functions.https.onCall(
    async (data, context) => {
        try {
            if (!context.auth) {
                throw new functions.https.HttpsError(
                    'failed-precondition',
                    'The function must be called while authenticated.',
                );
            }

            const { uid } = context.auth;
            const { profileData }: { profileData: ProfileDataType } = data;

            // delete his uid from my friendRequests
            const pr1 = admin
                .firestore()
                .collection('users')
                .doc(uid)
                .update({
                    friendRequests: admin.firestore.FieldValue.arrayRemove(
                        profileData.uid,
                    ),
                });

            const docData = await admin
                .firestore()
                .collection('users')
                .doc(uid)
                .collection('friendRequests')
                .where('uid', '==', profileData.uid)
                .get();
            const ref = docData.docs[0].ref;
            const pr2 = ref.delete();

            await Promise.all([pr1, pr2]);
        } catch (error) {
            throw new functions.https.HttpsError(
                'internal',
                'Something went wrong.',
            );
        }
    },
);
