import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NativeBaseProvider,
  ScrollView,
  Box,
  Text,
  VStack,
  HStack,
  Center,
  Image,
  Pressable,
  Divider,
  Heading,
  Input,
  Icon,
  Button,
  IconButton,
  Actionsheet,
  useDisclose,
  HamburgerIcon,
  Checkbox,
  FormControl
} from 'native-base';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { db } from "../../../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
// image


const HomepageGoogle = ({navigation}) => {
  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();
  const [selectedZodiac, setSelectedZodiac] = React.useState([]);
  const [selectedGender, setSelectedGender] = React.useState([]);
  const [data, setData] = useState([]);
  const focus = useIsFocused();
  const [searchValue, setSearchValue] = useState('');
  const [initialData, setInitialData] = useState([]);
  const uid = auth().currentUser?.email
  useEffect(() => {
    if (focus) {
      const fetchData = async () => {
        const produkRef = collection(db, 'produk');
        const q = query(produkRef, where('stokProduk', '!=', '0'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const tempList = [];
          snapshot.docs.forEach((doc) => {
            tempList.push(doc.data());
          });
          setData(tempList);
          setInitialData(tempList);
        });
        return () => unsubscribe();
      };

      fetchData();
    }
  }, [focus]);
  const handleZodiacChange = (values) => {
    setSelectedZodiac(values);
  };

  const handleGenderChange = (values) => {
    setSelectedGender(values);
  };

  const handleSearch = () => {
    let filteredData = initialData;

    if (selectedZodiac.length > 0) {
      filteredData = filteredData.filter((item) =>
        selectedZodiac.includes(item.zodiak)
      );
    }

    if (selectedGender.length > 0) {
      filteredData = filteredData.filter((item) =>
        selectedGender.includes(item.jenisKelamin)
      );
    }

    if (searchValue !== '') {
      filteredData = filteredData.filter((item) =>
        item.namaProduk.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    setData(filteredData);
  };

  // Memanggil handleSearch setiap kali terjadi perubahan pada groupValues
  useEffect(() => {
    handleSearch();
  }, [selectedZodiac, selectedGender]);

  return (
    <NativeBaseProvider>
      <SafeAreaView>
        <ScrollView>
          {/* Search */}
          <Box rounded="xl" p="5" mt="4" mx="5" bg="white">
            <HStack w="100%" space={5} alignSelf="center">
              <Input
                placeholder="Search"
                variant="filled"
                width="95%"
                borderRadius="10"
                py="2"
                px="2"
                value={searchValue}
                onChangeText={(text) => setSearchValue(text)}
                InputLeftElement={
                  <Icon
                    ml="2"
                    size="4"
                    color="gray.400"
                    as={<Ionicons name="ios-search" />}
                  />
                }
                InputRightElement={
                  <Button
                    onPress={handleSearch}
                    bg="transparent"
                    _pressed={{ bg: 'transparent' }}
                    _text={{ color: 'blue.500' }}
                  >
                    Search
                  </Button>
                }
              />
              <Pressable onPress={onOpen} mt="4">
                <HamburgerIcon />
              </Pressable>

              <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content>
                  <Box w="100%" h={60} px={4} justifyContent="center">
                    <Text fontSize="16" color="gray.500" _dark={{ color: "gray.300" }}>
                      Filter
                    </Text>
                  </Box>
                  <Actionsheet.Item>
                    <FormControl>
                      <FormControl.Label>Zodiac:</FormControl.Label>
                      <Checkbox.Group
                        onChange={handleZodiacChange}
                        value={selectedZodiac}
                        accessibilityLabel="choose numbers"
                      >
                        <VStack space={3}>
                          <HStack space={3}>
                            <Checkbox value="Aries">Aries</Checkbox>
                            <Checkbox value="Taurus">Taurus</Checkbox>
                            <Checkbox value="Gemini">Gemini</Checkbox>
                          </HStack>
                          <HStack space={3}>
                            <Checkbox value="Cancer">Cancer</Checkbox>
                            <Checkbox value="Leo">Leo</Checkbox>
                            <Checkbox value="Virgo">Virgo</Checkbox>
                          </HStack>
                          <HStack space={3}>
                            <Checkbox value="Libra">Libra</Checkbox>
                            <Checkbox value="Scorpio">Scorpio</Checkbox>
                            <Checkbox value="Sagitarius">Sagitarius</Checkbox>
                          </HStack>
                          <HStack space={3}>
                            <Checkbox value="Capricorn">Capricorn</Checkbox>
                            <Checkbox value="Aquarius">Aquarius</Checkbox>
                            <Checkbox value="Pisces">Pisces</Checkbox>
                          </HStack>
                        </VStack>
                      </Checkbox.Group>
                    </FormControl>
                  </Actionsheet.Item>
                  <Actionsheet.Item>
                    <FormControl>
                      <FormControl.Label>Cocok:</FormControl.Label>
                      <Checkbox.Group
                        onChange={handleGenderChange}
                        value={selectedGender}
                        accessibilityLabel="choose numbers"
                      >
                        <VStack space={3}>
                          <Checkbox value="UNISEX">Unisex</Checkbox>
                          <Checkbox value="Male">Male</Checkbox>
                          <Checkbox value="Female">Female</Checkbox>
                        </VStack>
                      </Checkbox.Group>
                    </FormControl>
                  </Actionsheet.Item>
                </Actionsheet.Content>
              </Actionsheet>
            </HStack>
          </Box>
          {/* End of search */}
          {data.length === 0 ? (
            <Center pt="5">
              <Text>No Products Available</Text>
            </Center>
          ) : (
            <Box>
              {data.map((data, index) => {
                return (
                  <Pressable
                    key={index}
                    onPress={() =>
                      navigation.navigate('DetailPageGoogle', {
                        detailProduk: data,
                      })
                    }
                  >
                    <Box bg="white" rounded="xl" p="5" mt="4" mx="5">
                      <VStack>
                        <Box>
                          <HStack space={2}>
                            <Box pt="1">
                              <Image
                                source={{ uri: data?.imgProduk }}
                                size="sm"
                                alt="foto"
                                rounded="sm"
                              />
                            </Box>
                            <Divider orientation="vertical" bg="black" mx="2" />
                            <VStack style={{ width: '40%' }} pt="1">
                              <Box>
                                <Text fontSize="xs">
                                  Zodiak: {data?.zodiak}
                                </Text>
                              </Box>
                              <Box>
                                <Text fontSize="xs">
                                  Cocok: {data?.jenisKelamin}
                                </Text>
                              </Box>
                              <Box>
                                <Text fontSize="xs">
                                  Umur: {data?.umurProduk}
                                </Text>
                              </Box>
                            </VStack>
                            <Divider orientation="vertical" bg="black" mx="2" />
                            <Box pt="1" style={{ width: '30%' }}>
                              <VStack space={0}>
                                <Box>
                                  <Text fontSize="md" bold>
                                    {data?.namaProduk}
                                  </Text>
                                </Box>
                                <Box>
                                  <Text bold color="#EFAF00" fontSize="xl">
                                  RP. {data?.hargaProduk}  {data?.hargaProduk2 ? <Text>- {data?.hargaProduk2}</Text> : <Text>- {data?.hargaProduk1}</Text>}
                                  </Text>
                                </Box>
                              </VStack>
                            </Box>
                          </HStack>
                          <Box alignSelf="flex-end"></Box>
                        </Box>
                      </VStack>
                    </Box>
                  </Pressable>
                );
              })}
            </Box>
          )}
        </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

export default HomepageGoogle;

