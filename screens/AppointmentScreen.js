import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
        <ScrollView style={styles.container}>
            <Text style={styles.welcomeText}>Merhaba, {email}</Text>
            
            <View style={styles.cardContainer}>
                <TouchableOpacity
                    style={[styles.card, styles.cardCreate]}
                    onPress={() => navigation.navigate('CreateAppointment')}>
                    <Icon name="add-circle-outline" size={30} color="#fff" />
                    <Text style={styles.cardTitle}>Randevu Oluştur</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, styles.cardList]}
                    onPress={() => navigation.navigate('ListoneAppointments')}>
                    <Icon name="format-list-bulleted" size={30} color="#fff" />
                    <Text style={styles.cardTitle}>Randevu Listele</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f4f4f4', // Arka plan rengi
    },
    welcomeText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#333',
      margin: 20,
      textAlign: 'center',
    },
    cardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
    card: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 15,
      margin: 10,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    cardCreate: {
      backgroundColor: '#4caf50', // Yeşil renk
    },
    cardList: {
      backgroundColor: '#2196f3', // Mavi renk
    },
    cardTitle: {
      marginTop: 10,
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
});

export default AppointmentScreen;
