// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import CreateAppointmentScreen from './screens/CreateAppointmentScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import AppointmentScreen from './screens/AppointmentScreen';
import AdminScreen from './screens/AdminScreen';
import ListAppointmentsScreen from './screens/ListAppointmentsScreen';
import { signOut } from '@firebase/auth';
import ListOneAppointmentsScreen from './screens/ListOneAppointmentsScreen';
import UpdateAppointmentsScreen from './screens/UpdateAppointmentsScreen';
import DeletAppointmentsScreen from './screens/DeletAppointmentsScreen';
import DoctorAdd from './screens/DoctorAdd ';
const Stack = createNativeStackNavigator();
import * as Notifications from 'expo-notifications';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegistrationScreen} />
        <Stack.Screen name="Appointment" component={AppointmentScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="ListAppointments" component={ListAppointmentsScreen} />
        <Stack.Screen name="ListoneAppointments" component={ListOneAppointmentsScreen} />
        <Stack.Screen name="CreateAppointment" component={CreateAppointmentScreen} />
        <Stack.Screen name="UpdateAppointments" component={UpdateAppointmentsScreen} />
        <Stack.Screen name="DeletAppointment" component={DeletAppointmentsScreen} />
        <Stack.Screen name="Doctor" component={DoctorAdd} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
