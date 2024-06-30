import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
// import Welcome from './app/screens/Welcome';
import Home from './app/screens/Home';
import Events from './app/screens/Events';
import Connect from './app/screens/Connect';
import Matches from './app/screens/Matches';
import Profile from './app/screens/Profile';
import Settings from './app/screens/Settings';
import Message from './app/screens/Message';
import ProfileSummary from './app/screens/ProfileSummary';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from './firebaseConfig';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen 
        name="Home" 
        component={Home} 
        options={{ headerShown: false, animation: 'none' }}
      />
      <InsideStack.Screen 
        name="Events" 
        component={Events} 
        options={{ headerShown: false, animation: 'none' }}
      />
      <InsideStack.Screen 
        name="Connect" 
        component={Connect} 
        options={{ headerShown: false, animation: 'none' }}
      />
      <InsideStack.Screen 
        name="Matches" 
        component={Matches} 
        options={{ headerShown: false, animation: 'none' }}
      />
      <InsideStack.Screen 
        name="Profile" 
        component={Profile} 
        options={{ headerShown: false, animation: 'none' }}
      />
      <InsideStack.Screen 
        name="Settings" 
        component={Settings} 
        options={{ headerShown: false, animation: 'none' }}
      />
      <InsideStack.Screen 
        name="Message" 
        component={Message} 
        options={{ headerShown: true, animation: 'none' }}
      />
      <InsideStack.Screen 
        name="ProfileSummary" 
        component={ProfileSummary} 
        options={{ headerShown: true, animation: 'none' }}
      />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
          <Stack.Screen 
            name='Inside' 
            component={InsideLayout} 
            options={{ headerShown: false, animation: 'none' }} 
          />
        ) : (
          <Stack.Screen 
            name='Login' 
            component={Login} 
            options={{ headerShown: false, animation: 'none' }} 
          />
        )}
      </Stack.Navigator>

    </NavigationContainer>
  );
}
