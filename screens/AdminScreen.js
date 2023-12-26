// screens/AdminScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { logoutUser } from '../FirebasseConfig';
import LottieView from 'lottie-react-native';

const AdminScreen = ({ navigation, route }) => {
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
      
      <View style={styles.cardContainer}>
          <TouchableOpacity
              style={[styles.card, styles.cardCreate]}
              onPress={() => navigation.navigate('Doctor')}>
              <Icon name="add-circle-outline" size={30} color="#fff" />
              <Text style={styles.cardTitle}>Doktor Ekle</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.card, styles.cardList]}
              onPress={() => navigation.navigate('ListAppointments')}>
              <Icon name="format-list-bulleted" size={30} color="#fff" />
              <Text style={styles.cardTitle}>Randevulari Listele</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.card, styles.docList]}
              onPress={() => navigation.navigate('DoctorListScreen')}>
              <Icon name="format-list-bulleted" size={30} color="#fff" />
              <Text style={styles.cardTitle}>doktorlari Listele</Text>
          </TouchableOpacity>
         
      </View>

      <View style={styles.lottieContainer}>
          <LottieView
            source={require('../resim/admin.json')} // Make sure this path is correct
            autoPlay
            loop={true}
            style={styles.lottieAnimation}
          />
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
  docList:{
    backgroundColor: '#FFA500', // Turuncu renk
  },
  cardTitle: {
    marginTop: 10,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  lottieContainer: {
    alignItems: 'center', // Center the LottieView horizontally
    justifyContent: 'center', // Center the LottieView vertically
    marginTop: 0, // Add some space above the LottieView
  },
  lottieAnimation: {
    width: 300, // Adjust width as needed
    height: 400, // Adjust height as needed
  },
});

export default AdminScreen;










