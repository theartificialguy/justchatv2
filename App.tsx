import React from 'react';
import { Provider } from 'react-redux';
import Navigation from './src/navigation';
import { store } from './src/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
    return (
        <Provider store={store}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Navigation />
            </GestureHandlerRootView>
        </Provider>
    );
};

export default App;
