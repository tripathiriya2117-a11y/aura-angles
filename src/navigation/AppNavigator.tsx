import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import CollectionScreen from "../screens/CollectionScreen";
import ItemScreen from "../screens/ItemScreen";
import TasksScreen from "../screens/TasksScreen";

import { PlanetData } from "../types/planet";
import { CollectionData } from "../types/collection";


export type RootStackParamList = {
  Home: undefined;
  Collection: {
    planet: PlanetData;
  };
  Items: {
    collection: CollectionData;
  };
  Tasks: undefined;
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />

      <Stack.Screen
        name="Collection"
        component={CollectionScreen}
      />

      <Stack.Screen
        name="Items"
        component={ItemScreen}
      />

      <Stack.Screen
        name="Tasks"
        component={TasksScreen}
      />
    </Stack.Navigator>
  );
}