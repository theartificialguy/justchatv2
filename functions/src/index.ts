import * as admin from 'firebase-admin';

// Friend Request Management
export { sendRequest } from './friendRequestManagement/sendRequest';
export { removeFriend } from './friendRequestManagement/removeFriend';
export { cancelRequest } from './friendRequestManagement/cancelRequest';
export { acceptFriendRequest } from './friendRequestManagement/acceptFriendRequest';
export { rejectFriendRequest } from './friendRequestManagement/rejectFriendRequest';

// Rooms Management
export { createPrivateRoom } from './rooms/createPrivateRoom';

admin.initializeApp();
