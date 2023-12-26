import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { FIRESTORE_DB } from '../FirebasseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDocs } from 'firebase/firestore';
import LottieView from 'lottie-react-native';
import { DotIndicator } from 'react-native-indicators';

const CreateAppointmentScreen = ({ navigation }) => {
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [workingDays, setWorkingDays] = useState([]);
  const [selectedWorkingDay, setSelectedWorkingDay] = useState('');
  const [workingHours, setWorkingHours] = useState([]);
  const [selectedWorkingHour, setSelectedWorkingHour] = useState('');
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'doctors'));
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setDoctors(docs);
    };

    fetchDoctors();
  }, []);

  const validateInput = () => {
    let isValid = true;
    let newErrors = {};

    if (!appointmentTitle.trim()) {
      newErrors.appointmentTitle = 'Lütfen bir randevu başlığı giriniz.';
      isValid = false;
    }

    if (!selectedDoctor) {
      newErrors.selectedDoctor = 'Lütfen bir doktor seçiniz.';
      isValid = false;
    }

    if (!selectedWorkingDay) {
      newErrors.selectedWorkingDay = 'Lütfen bir çalışma günü seçiniz.';
      isValid = false;
    }

    if (!selectedWorkingHour) {
      newErrors.selectedWorkingHour = 'Lütfen bir çalışma saati seçiniz.';
      isValid = false;
    }

    setError(newErrors);
    return isValid;
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);

    // Doktorun çalışma günlerini ve saatlerini ayarlayın
    setWorkingDays(doctor.workingDays);
    setWorkingHours(doctor.workingHours);

    setModalVisible(false);
  };

  const handleSelectWorkingDay = (day) => {
    setSelectedWorkingDay(day);
  };

  const handleSelectWorkingHour = (hour) => {
    setSelectedWorkingHour(hour);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || appointmentDate;
    setShowDatePicker(Platform.OS === 'ios');
    setAppointmentDate(currentDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('tr-TR');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleSelectDoctor(item)}
    >
      <Text style={styles.text}>
        {`${item.name} (${item.department}, ${item.clinic})`}
      </Text>
    </TouchableOpacity>
  );

  const renderWorkingHoursItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.workingHourButton,
        item === selectedWorkingHour ? styles.selectedWorkingHour : null,
      ]}
      onPress={() => handleSelectWorkingHour(item)}
    >
      <Text style={styles.workingHourText}>{item}</Text>
    </TouchableOpacity>
  );

  const handleCreateAppointment = async () => {
    if (validateInput()) {
      try {
        setIsLoading(true);

        const auth = getAuth();
        const user = auth.currentUser;
        const userEmail = user.email;
        const userId = user.uid;
        const dateString = appointmentDate.toISOString();

        await addDoc(collection(FIRESTORE_DB, 'appointments'), {
          title: appointmentTitle,
          date: dateString,
          doctorId: selectedDoctor, // Doktorun kimliğini buraya ekleyin
          userId: userId,
          userEmail: userEmail,
          workingDay: selectedWorkingDay,
          workingHour: selectedWorkingHour,


        });
        setIsLoading(false);

        Alert.alert('Başarılı', 'Randevu oluşturuldu', [
          { text: 'Tamam', onPress: () => navigation.goBack() },
        ]);

        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Randevunuz Oluşturuldu 📅',
            body: 'Yeni randevunuz başarıyla oluşturuldu. Randevu detaylarınızı kontrol ediniz.',
          },
          trigger: { seconds: 1 },
        });
      } catch (error) {
        setIsLoading(false);

        Alert.alert('Hata', 'Randevu oluşturulamadı');
      }
      setAppointmentTitle('');
      setSelectedDoctor(null);
      setSelectedWorkingDay('');
      setSelectedWorkingHour(''); // Çalışma saati seçiminin sıfırlanması
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Yeni Randevu Oluştur</Text>

      <TextInput
        style={error.appointmentTitle ? styles.inputError : styles.input}
        value={appointmentTitle}
        onChangeText={(text) => {
          setAppointmentTitle(text);
          if (error.appointmentTitle) {
            setError((prevState) => ({ ...prevState, appointmentTitle: '' }));
          }
        }}
        maxLength={30}
        placeholder="Randevu Başlığı"
      />
      {error.appointmentTitle ? (
        <Text style={styles.errorText}>{error.appointmentTitle}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {selectedDoctor
            ? `${selectedDoctor.name} (${selectedDoctor.department}, ${selectedDoctor.clinic})`
            : 'Doktor Seç'}
        </Text>
      </TouchableOpacity>
      {error.selectedDoctor ? (
        <Text style={styles.errorText}>{error.selectedDoctor}</Text>
      ) : null}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={doctors}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {workingDays.length > 0 && (
        <View style={styles.workingDaysContainer}>
          <Text style={styles.subHeader}></Text>
          <FlatList
            data={workingDays}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.dayButton,
                  item === selectedWorkingDay ? styles.selectedDay : null,
                ]}
                onPress={() => handleSelectWorkingDay(item)}
              >
                <Text style={styles.dayText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            horizontal={true}
          />
          {error.selectedWorkingDay ? (
            <Text style={styles.errorText}>{error.selectedWorkingDay}</Text>
          ) : null}
        </View>
      )}

      {workingHours.length > 0 && (
        <View style={styles.workingDaysContainer}>
          <Text style={styles.subHeader}></Text>
          <FlatList
            data={workingHours}
            renderItem={renderWorkingHoursItem}
            keyExtractor={(item) => item}
            horizontal={true}
          />
          {error.selectedWorkingHour ? (
            <Text style={styles.errorText}>{error.selectedWorkingHour}</Text>
          ) : null}
        </View>
      )}

      <TouchableOpacity
        style={styles.createAppointmentButton}
        onPress={handleCreateAppointment}
      >
        <Text style={styles.createAppointmentButtonText}>
          Randevu Oluştur
        </Text>
      </TouchableOpacity>
      <View style={styles.lottieContainer}>
        <LottieView
          source={require('../resim/r3.json')}
          autoPlay
          loop={true}
          style={styles.lottieAnimation}
        />
      </View>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <DotIndicator color="#2196f3" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subHeader: {
    marginBottom: 0,
  },
  inputError: {
    width: '100%',
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    borderColor: 'red',
    borderWidth: 2,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  dateInput: {
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  dateText: {
    color: '#333',
  },
  button: {
    width: '100%',
    padding: 16,
    backgroundColor: '#ddd',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  workingDaysContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 16,
  },
  selectedDay: {
    backgroundColor: '#4a90e2',
  },
  workingHourButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  workingHourText: {
    fontSize: 16,
  },
  selectedWorkingHour: {
    backgroundColor: '#4a90e2',
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  createAppointmentButton: {
    width: '50%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  createAppointmentButtonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
  },
  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  lottieAnimation: {
    width: 300,
    height: 400,
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
});
export default CreateAppointmentScreen;
