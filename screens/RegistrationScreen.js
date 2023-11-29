// screens/RegistrationScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';

const RegistrationScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistration = () => {
    // Kayıt işlemini burada gerçekleştirin
    console.log('Kullanıcı kaydedildi:', username, email);
    // Örneğin, bir API'ye POST isteği göndererek kayıt işlemini tamamlayabilirsiniz.
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Kullanıcı adı"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="E-posta"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Şifre"
        secureTextEntry
      />
      <Button title="Kaydol" color="#4a90e2" onPress={handleRegistration} />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Zaten bir hesabınız var mı? Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#f5f5f5',
    },
    input: {
      height: 50,
      borderColor: '#e1e1e1',
      borderWidth: 1,
      marginBottom: 15,
      paddingHorizontal: 10,
      borderRadius: 5,
      backgroundColor: '#fff',
    },
    linkText: {
      color: '#4a90e2',
      marginTop: 15,
      textAlign: 'center',
    },
  });
export default RegistrationScreen;
