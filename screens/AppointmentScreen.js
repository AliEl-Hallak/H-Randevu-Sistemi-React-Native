import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { logoutUser } from '../FirebasseConfig';

const AppointmentScreen = ({ navigation, route }) => {
    const { email } = route.params;

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => logoutUser(navigation)}>
                    <Icon name="logout" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('CreateAppointment')}>
        <Text style={styles.cardTitle}>Randevu olustur</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ListoneAppointments')}>
        <Text style={styles.cardTitle}>Randevu listele</Text>
      </TouchableOpacity>
    

            <Text>Merhaba, {email}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
    },
    card: {
      width: '90%',
      padding: 20,
      marginVertical: 10,
      backgroundColor: '#4a90e2',
      borderRadius: 10,
    },
    cardTitle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });


export default AppointmentScreen;
