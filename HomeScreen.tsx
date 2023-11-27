import * as LocalAuthentication from 'expo-local-authentication';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

type AuthOptions = {
    availableAuthentication: boolean;
    authenticationTypes: string[];
};

type HomeScreenProps = {
    navigation: NavigationProp<Record<string, object>>;
  };  

export default function HomeScreen({ navigation }: HomeScreenProps) {
    
    const [authOptions, setAuthOptions] = useState<AuthOptions>({
      availableAuthentication: false,
      authenticationTypes: [],
    });
  
    const verifyAuthentication = async () => {
      const availableAuthentication =
        await LocalAuthentication.hasHardwareAsync();
  
      if (!availableAuthentication) return;
  
      const authenticationTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
  
      setAuthOptions({
        availableAuthentication,
        authenticationTypes: authenticationTypes.map(
          (type) => LocalAuthentication.AuthenticationType[type]
        ),
      });
    };
  
    const handleAuthentication = async () => {
      const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();
  
      if (!isBiometricEnrolled) {
        return Alert.alert('Authentication', 'Biometry not found.');
      }
  
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authentication with biometry',
        fallbackLabel: 'Biometry not recognized',
      });
  
      if (auth.success) {
        navigation.navigate('TodoList', {})
      } else {
        return Alert.alert('Authentication', 'Authentication failed!');
      }
    };
  
    useEffect(() => {
      verifyAuthentication();
    }, []);

    return (
        <View style={styles.container}>
          <StatusBar style="auto" />
    
          <View>
            <Text style={[styles.text, styles.textBold]}>
              Available Authentication:
            </Text>
            <Text style={styles.text}>
              {authOptions.availableAuthentication ? 'Yes' : 'No'}
            </Text>
    
            {authOptions.availableAuthentication && (
              <>
                <Text style={[styles.text, styles.textBold]}>
                  Authentication Types:
                </Text>
                <Text style={styles.text}>{authOptions.authenticationTypes}</Text>
              </>
            )}
          </View>
    
          <Button title="Auth" onPress={handleAuthentication} />
        </View>
    );  
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 30,
    },
    text: {
      fontSize: 18,
      marginTop: 10,
      textAlign: 'center',
    },
    textBold: {
      fontWeight: 'bold',
      marginTop: 20,
    },
  });
  