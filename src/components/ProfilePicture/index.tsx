import React from 'react';
import { Image } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ProfilePictureProp } from '../../types/models';

const avatar_placeholder = require('../../../assets/images/avatar-placeholder.png');

const ProfilePicture = ({
    uri,
    height = 40,
    width = 40,
}: ProfilePictureProp) => {
    const user = useSelector((state: RootState) => state.user.user);
    return (
        <Image
            resizeMode="cover"
            style={{ height, width, borderRadius: height / 2 }}
            source={
                uri
                    ? { uri }
                    : user?.photoURL
                    ? { uri: user?.photoURL }
                    : avatar_placeholder
            }
        />
    );
};

export default ProfilePicture;
