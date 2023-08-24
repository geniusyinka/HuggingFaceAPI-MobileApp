/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {useState, type PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  NativeBaseProvider,
  Text,
  Box,
  Stack,
  Input,
  Button,
  Center,
} from 'native-base';

import axios from 'axios';


import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {API_TOKEN} from "@env"

type SectionProps = PropsWithChildren<{
  title: string;
}>;

global.Buffer = require('buffer').Buffer;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}
// interface QueryData {
//   inputs: string;
// }

async function query(QueryData) {
  try {
    const response = await axios({
      url: `https://api-inference.huggingface.co/models/SG161222/Realistic_Vision_V1.4`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`, // Remember to manage your tokens securely
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: QueryData,
      responseType: 'arraybuffer',
    });

    const mimeType = response.headers['content-type'];
    const result = response.data;

    const base64data = Buffer.from(result, 'binary').toString('base64');
    const img = `data:${mimeType};base64,${base64data}`;

    return img;
  } catch (error) {
    console.error('Error making the request:', error);
    throw error;
  }
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [inputText, setInputText] = useState('');
  const [imageData, setImageData] = useState('');
  const [loading, setLoading] = useState(false);


  const handleButtonClick = async () => {
    setLoading(true);
    try {
      const data = {inputs: inputText}; // Make sure inputText is defined
      const response = await query(data);

      // Handle the image response
      console.log('Image Response:', response);
      setLoading(false);
      setImageData(response);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <NativeBaseProvider>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Center>
              <Section title="">Input your prompt in the field below.</Section>
            </Center>
            <View>
              <Box alignItems="center">
                <Box
                  flex={1}
                  bg="#fff"
                  alignItems="center"
                  justifyContent="center">
                  <Text></Text>
                </Box>
                <Stack space={4} w="75%" maxW="300px" mx="auto">
                  <Input
                    size="md"
                    placeholder="Blackhole"
                    value={inputText}
                    onChangeText={setInputText}
                  />
                </Stack>
                <Button
                  size="sm"
                  mt={5}
                  variant="outline"
                  colorScheme="primary"
                  onPress={handleButtonClick}>
                  Submit
                </Button>
              </Box>
            </View>
            <Center mt={5}>
              {loading ? (
                <ActivityIndicator size="large" color="#00ff00" />
              ) : (
                imageData && (
                  <Image
                    source={{uri: `${imageData}`}}
                    style={{width: 300, height: 300}}
                  />
                )
              )}
            </Center>
          </View>
        </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
