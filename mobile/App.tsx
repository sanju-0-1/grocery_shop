import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GroceryProvider } from './src/context/GroceryContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Colors } from './src/constants/theme';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <GroceryProvider>
          <NavigationIndependentTree>
            <NavigationContainer>
              <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
              <RootNavigator />
            </NavigationContainer>
          </NavigationIndependentTree>
        </GroceryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
