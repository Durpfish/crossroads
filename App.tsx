import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
import Welcome from './app/screens/Welcome';
import Home from './app/screens/Home';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from './firebaseConfig';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }}/>
      <InsideStack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
    </InsideStack.Navigator>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  onAuthStateChanged(FIREBASE_AUTH, (user) => {
    console.log('user', user);
    setUser(user);

  });
}, [])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName = 'Login'>
        {user ? (
        <Stack.Screen name='Inside' component={InsideLayout} options={{ headerShown: false }} />
        ) : (
        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>

    </NavigationContainer>
  );
}
