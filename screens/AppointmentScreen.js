// AppointmentScreen.js
import React ,{ useState } from 'react';

import { View, TouchableOpacity, ScrollView,ActivityIndicator, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebasseConfig';
import { doc, getDoc } from '@firebase/firestore';
import { logoutUser } from '../FirebasseConfig';
import LottieView from 'lottie-react-native';

const AppointmentScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false); // Veriler yükleniyor başlangıçta true olarak ayarlandı

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={handleUserDetails}>
            <Icon name="person" size={35} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => logoutUser(navigation)} style={{ marginLeft: 15 }}>
            <Icon name="logout" size={30} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const handleUserDetails = async () => {
    setIsLoading(true); // Veriler yüklendiğinde beklemeyi kaldır

    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userDetails = await getUserDetails(user.uid);
      if (userDetails) {
        setIsLoading(false); // Veriler yüklendiğinde beklemeyi kaldır


        navigation.navigate('UserProfile', {
          email: user.email,
          username: userDetails.username,
          phoneNumber: userDetails.phoneNumber
        });
      }
    }
  };

  // ...

  return (
    <ScrollView style={styles.container}>
             {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4caf50" />
        </View>
      )}
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


        <View style={styles.lottieContainer}>
          <LottieView
            source={require('../resim/r2.json')} // Make sure this path is correct
            autoPlay
            loop={true}
            style={styles.lottieAnimation}
          />
        </View>
    </ScrollView>
);

};

async function getUserDetails(userId) {
  const userRef = doc(FIRESTORE_DB, 'users', userId);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log('No such user!');
    return null;
  }
}
   

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
    cardTitle: {
      marginTop: 10,
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    lottieContainer: {
      alignItems: 'center', // Center the LottieView horizontally
      justifyContent: 'center', // Center the LottieView vertically
      marginTop: 0, // Add some space above the LottieView
    },
    lottieAnimation: {
      width: 300, // Adjust width as needed
      height: 450, // Adjust height as needed
    },
});

export default AppointmentScreen;
