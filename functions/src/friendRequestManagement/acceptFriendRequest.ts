import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { ProfileDataType } from '../models';

export const acceptFriendRequest = functions.https.onCall(
    async (data, context) => {
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
            }: {
                profileData: ProfileDataType;
                myProfileData: ProfileDataType;
            } = data;

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

            const docData1 = await admin
                .firestore()
                .collection('users')
                .doc(uid)
                .collection('friendRequests')
                .where('uid', '==', profileData.uid)
                .get();
            const ref1 = docData1.docs[0].ref;
            const pr2 = ref1.delete();

            // add his uid to my friends
            const pr3 = admin
                .firestore()
                .collection('users')
                .doc(uid)
                .update({
                    friends: admin.firestore.FieldValue.arrayUnion(
                        profileData.uid,
                    ),
                });

            const pr4 = admin
                .firestore()
                .collection('users')
                .doc(uid)
                .collection('friends')
                .add(profileData);

            // add my uid to his friends
            const pr5 = admin
                .firestore()
                .collection('users')
                .doc(profileData.uid)
                .update({
                    friends: admin.firestore.FieldValue.arrayUnion(uid),
                });

            const pr6 = admin
                .firestore()
                .collection('users')
                .doc(profileData.uid)
                .collection('friends')
                .add(myProfileData);

            await Promise.all([pr1, pr2, pr3, pr4, pr5, pr6]);
        } catch (error) {
            throw new functions.https.HttpsError(
                'internal',
                'Something went wrong.',
            );
        }
    },
);
