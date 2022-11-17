/* eslint-disable curly */
/* eslint-disable dot-notation */
import firestore from '@react-native-firebase/firestore';
import {
    AddFriendListItemType,
    MessageType,
    PrivateRoomType,
} from '../types/models';

export enum FriendStatus {
    ADD = 'Add',
    FRIEND = 'Remove',
    REQUEST = 'Request',
    PENDING = 'Cancel',
    UNKNOWN = 'Unknown',
}

export const checkFriendStatus = async (uid: string, fuid: string) => {
    const myDocData = await firestore().collection('users').doc(uid).get();
    const docData = await firestore().collection('users').doc(fuid).get();
    let status = FriendStatus.UNKNOWN;
    if (myDocData.exists && docData.exists) {
        const myFriends = myDocData.data()?.['friends'] as string[];
        const myFriendRequests = myDocData.data()?.friendRequests as string[];
        const friends = docData.data()?.['friends'] as string[];
        const friendRequests = docData.data()?.['friendRequests'] as string[];
        if (
            !friends.includes(uid) &&
            !friendRequests.includes(uid) &&
            !myFriends.includes(fuid) &&
            !myFriendRequests.includes(fuid)
        ) {
            // show ADD when - my uid not in her friends & friendRequests
            status = FriendStatus.ADD;
        } else if (friendRequests.includes(uid)) {
            // show PENDING when - my uid in her friendRequests
            status = FriendStatus.PENDING;
        } else if (friends.includes(uid)) {
            // show FRIEND when - my uid in her friends
            status = FriendStatus.FRIEND;
        } else if (myFriendRequests.includes(fuid)) {
            // show ACCEPT or REJECT when - her uid in my friendRequests
            status = FriendStatus.REQUEST;
        } else {
            status = FriendStatus.UNKNOWN;
        }
    }
    return status;
};

export const sendFriendRequest = async (
    myProfileData: AddFriendListItemType,
    profileData: AddFriendListItemType,
) => {
    try {
        const p1 = new Promise<void>((resolve, reject) => {
            firestore()
                .collection('users')
                .doc(profileData.uid)
                .update({
                    friendRequests: firestore.FieldValue.arrayUnion(
                        myProfileData.uid,
                    ),
                })
                .then(() => resolve())
                .catch(() => reject());
        });
        const p2 = new Promise<void>((resolve, reject) => {
            firestore()
                .collection('users')
                .doc(profileData.uid)
                .collection('friendRequests')
                .add(myProfileData)
                .then(() => resolve())
                .catch(() => reject());
        });
        await Promise.all([p1, p2]);
    } catch (error) {
        console.log('Error while trying to send friend request', error);
    }
};

export const cancelSentFriendRequest = async (
    myProfileData: AddFriendListItemType,
    profileData: AddFriendListItemType,
) => {
    try {
        const promise1 = new Promise<void>((resolve, reject) => {
            firestore()
                .collection('users')
                .doc(profileData.uid)
                .update({
                    friendRequests: firestore.FieldValue.arrayRemove(
                        myProfileData.uid,
                    ),
                })
                .then(() => resolve())
                .catch(() => reject());
        });

        const promise2 = new Promise<void>(async (resolve, reject) => {
            const docData = await firestore()
                .collection('users')
                .doc(profileData.uid)
                .collection('friendRequests')
                .where('uid', '==', myProfileData.uid)
                .get();
            const ref = docData.docs[0].ref;
            ref.delete()
                .then(() => resolve())
                .catch(() => reject());
        });

        await Promise.all([promise1, promise2]);
    } catch (error) {
        console.log('Error while trying to cancel friend request', error);
    }
};

export const removeFriend = async (
    myProfileData: AddFriendListItemType,
    profileData: AddFriendListItemType,
) => {
    try {
        // deleting my uid and data from his profile
        const promise1 = new Promise<void>(async (resolve, reject) => {
            try {
                await firestore()
                    .collection('users')
                    .doc(profileData.uid)
                    .update({
                        friends: firestore.FieldValue.arrayRemove(
                            myProfileData.uid,
                        ),
                    });
                resolve();
            } catch (error) {
                reject();
            }
        });

        const promise2 = new Promise<void>(async (resolve, reject) => {
            try {
                const docData = await firestore()
                    .collection('users')
                    .doc(profileData.uid)
                    .collection('friends')
                    .where('uid', '==', myProfileData.uid)
                    .get();
                const ref = docData.docs[0].ref;
                await ref.delete();
                resolve();
            } catch (error) {
                reject();
            }
        });

        // deleting his uid and data from my profile
        const promise3 = new Promise<void>(async (resolve, reject) => {
            try {
                await firestore()
                    .collection('users')
                    .doc(myProfileData.uid)
                    .update({
                        friends: firestore.FieldValue.arrayRemove(
                            profileData.uid,
                        ),
                    });
                resolve();
            } catch (error) {
                reject();
            }
        });

        const promise4 = new Promise<void>(async (resolve, reject) => {
            try {
                const docData = await firestore()
                    .collection('users')
                    .doc(myProfileData.uid)
                    .collection('friends')
                    .where('uid', '==', profileData.uid)
                    .get();
                const ref = docData.docs[0].ref;
                await ref.delete();
                resolve();
            } catch (error) {
                reject();
            }
        });

        await Promise.all([promise1, promise2, promise3, promise4]);
    } catch (error) {
        console.log('Error while trying to cancel friend request', error);
    }
};

export const acceptFriendRequest = async (
    myProfileData: AddFriendListItemType,
    profileData: AddFriendListItemType,
) => {
    try {
        // delete his uid from my friendRequests
        const pr1 = new Promise<void>(async (resolve, reject) => {
            try {
                await firestore()
                    .collection('users')
                    .doc(myProfileData.uid)
                    .update({
                        friendRequests: firestore.FieldValue.arrayRemove(
                            profileData.uid,
                        ),
                    });
                resolve();
            } catch (error) {
                reject();
            }
        });

        const pr2 = new Promise<void>(async (resolve, reject) => {
            try {
                const docData = await firestore()
                    .collection('users')
                    .doc(myProfileData.uid)
                    .collection('friendRequests')
                    .where('uid', '==', profileData.uid)
                    .get();
                const ref = docData.docs[0].ref;
                await ref.delete();
                resolve();
            } catch (error) {
                reject();
            }
        });

        // add his uid to my friends
        const pr3 = new Promise<void>((resolve, reject) => {
            firestore()
                .collection('users')
                .doc(myProfileData.uid)
                .update({
                    friends: firestore.FieldValue.arrayUnion(profileData.uid),
                })
                .then(() => resolve())
                .catch(() => reject());
        });

        const pr4 = new Promise<void>((resolve, reject) => {
            firestore()
                .collection('users')
                .doc(myProfileData.uid)
                .collection('friends')
                .add(profileData)
                .then(() => resolve())
                .catch(() => reject());
        });

        // add my uid to his friends
        const pr5 = new Promise<void>((resolve, reject) => {
            firestore()
                .collection('users')
                .doc(profileData.uid)
                .update({
                    friends: firestore.FieldValue.arrayUnion(myProfileData.uid),
                })
                .then(() => resolve())
                .catch(() => reject());
        });

        const pr6 = new Promise<void>((resolve, reject) => {
            firestore()
                .collection('users')
                .doc(profileData.uid)
                .collection('friends')
                .add(myProfileData)
                .then(() => resolve())
                .catch(() => reject());
        });

        await Promise.all([pr1, pr2, pr3, pr4, pr5, pr6]);
    } catch (error) {
        console.log('Error while trying to accept friend request', error);
    }
};

export const rejectFriendRequest = async (
    myProfileData: AddFriendListItemType,
    profileData: AddFriendListItemType,
) => {
    try {
        // delete his uid from my friendRequests
        const pr1 = new Promise<void>(async (resolve, reject) => {
            try {
                await firestore()
                    .collection('users')
                    .doc(myProfileData.uid)
                    .update({
                        friendRequests: firestore.FieldValue.arrayRemove(
                            profileData.uid,
                        ),
                    });
                resolve();
            } catch (error) {
                reject();
            }
        });

        const pr2 = new Promise<void>(async (resolve, reject) => {
            try {
                const docData = await firestore()
                    .collection('users')
                    .doc(myProfileData.uid)
                    .collection('friendRequests')
                    .where('uid', '==', profileData.uid)
                    .get();
                const ref = docData.docs[0].ref;
                await ref.delete();
                resolve();
            } catch (error) {
                reject();
            }
        });

        await Promise.all([pr1, pr2]);
    } catch (error) {
        console.log('Error while trying to reject friend request', error);
    }
};

export const createPrivateRoom = async (args: PrivateRoomType) => {
    try {
        // add room
        const ref = firestore().collection('rooms').doc();
        const roomId = ref.id;
        const data = { id: roomId, ...args };
        await ref.set(data);
        // update profiles
        const usersRef = firestore().collection('users');
        const asyncOperations = args.members.map(async userId => {
            try {
                await usersRef.doc(userId).update({
                    roomIds: firestore.FieldValue.arrayUnion(roomId),
                });
                await usersRef.doc(userId).collection('rooms').doc(roomId).set({
                    id: roomId,
                    members: args.members,
                    unreadMessagesCount: 0,
                });
            } catch (error) {
                console.log(error);
            }
        });
        await Promise.all(asyncOperations);
        return roomId;
    } catch (error) {
        console.log('Error while trying to create room', error);
    }
};

export const createMessage = async (
    roomId: string,
    data: MessageType,
    members: string[],
) => {
    try {
        if (members.length === 0 || roomId === '') return;
        // create new message
        const ref = firestore().collection('rooms').doc(roomId);
        await ref.collection('messages').add(data);
        // update room's last message
        await ref.update({
            lastMessage: {
                text: data.text,
                senderId: data.senderId,
                timestamp: data.timestamp,
            },
        });
        // update unread message count for all members except this user
        await Promise.all(
            members.map(async userId => {
                await firestore()
                    .collection('users')
                    .doc(userId)
                    .collection('rooms')
                    .doc(roomId)
                    .update({
                        unreadMessagesCount: firestore.FieldValue.increment(1),
                    });
            }),
        );
    } catch (error) {
        console.log('Error while trying to send message', error);
    }
};
