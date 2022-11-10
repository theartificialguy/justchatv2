import React from 'react';
import { View } from 'react-native';

const ListSeparator = () => {
    return (
        <View
            style={{
                flex: 1,
                height: 1,
                backgroundColor: 'gray',
                marginVertical: 5,
            }}
        />
    );
};

export default ListSeparator;
