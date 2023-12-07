import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FIREBASE_AUTH } from '../FirebasseConfig'; // Firebase Authentication'ı import ediyoruz

const UserProfileScreen = ({ route, navigation }) => {
  // Aktif kullanıcının bilgilerini alıyoruz
  const user = FIREBASE_AUTH.currentUser;

  // Eğer bir kullanıcı varsa, onun bilgilerini kullanıyoruz
  const uid = user ? user.uid : null;
  const { username, email, phoneNumber } = route.params;

  const handleEditProfile = () => {
    // Eğer uid yoksa, hata mesajı göster
    if (!uid) {
      console.error('Kullanıcı ID bulunamadı');
      return;
    }

    // Profil düzenleme ekranına yönlendirme
    navigation.navigate('EditProfileScreen', {
      uid,
      username,
      email,
      phoneNumber,
    });
  };


  return (
    <View style={styles.container}>
      <Image
        source={require('./user-avatar.png')} // Profil resmi
        style={styles.avatar}
      />
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.email}>{email}</Text>
      <Text style={styles.phoneNumber}>{phoneNumber}</Text>

      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Icon name="edit" size={24} color="white" />
        <Text style={styles.editButtonText}>Profili Düzenle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', // Arkaplan rengi
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
  phoneNumber: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#4caf50', // Düzenleme düğmesi rengi
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default UserProfileScreen;
