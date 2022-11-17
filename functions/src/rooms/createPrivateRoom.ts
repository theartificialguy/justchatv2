import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const createPrivateRoom = functions.https.onCall(
    async (data, context) => {
        try {
            if (!context.auth) {
                throw new functions.https.HttpsError(
                    'failed-precondition',
                    'The function must be called while authenticated.',
                );
            }

            const { uid } = context.auth;
            const { friendUid }: { friendUid: string } = data;

            // add room
            const ref = admin.firestore().collection('rooms').doc();
            const roomId = ref.id;
            const members = [uid, friendUid];

            const roomData = {
                id: roomId,
                type: 'PRIVATE',
                lastMessage: {
                    text: '',
                    senderId: '',
                    timestamp: admin.firestore.Timestamp.fromDate(new Date()),
                },
                members,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            await ref.set(roomData);

            // update profiles
            const usersRef = admin.firestore().collection('users');
            const asyncOperations = members.map(async userId => {
                try {
                    await usersRef.doc(userId).update({
                        roomIds: admin.firestore.FieldValue.arrayUnion(roomId),
                    });
                    await usersRef
                        .doc(userId)
                        .collection('rooms')
                        .doc(roomId)
                        .set({
                            id: roomId,
                            members,
                            unreadMessagesCount: 0,
                        });
                } catch (error) {
                    console.log(error);
                }
            });
            await Promise.all(asyncOperations);
        } catch (error) {
            throw new functions.https.HttpsError(
                'internal',
                'Something went wrong.',
            );
        }
    },
);
