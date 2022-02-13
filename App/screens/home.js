import React, { useState, useEffect, useContext } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { format } from "date-fns";
import { Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

import colors from "../constants/colors";
import { ConversionInput } from "../components/conversionInput";
import { Button } from "../components/button";
import { KeyboardSpacer } from "../components/keyboardSpacer";
import { Options } from "./options";
import { ConversionContext } from "../util/conversionContext";

const screen = Dimensions.get("window");

export default ({ navigation }) => {
  const { baseCurrency, quoteCurrency, swapCurrencies } =
    useContext(ConversionContext);
  const [value, setValue] = useState("1");
  const [isLoading, setIsLoading] = useState(true);

  const [conversionRate, setConversionRate] = useState(0.00007);
  const date = new Date().toISOString().split("T")[0];

  const [scrollEnabled, setScrollEnabled] = useState(false);

  axios
    .get(
      `https://freecurrencyapi.net/api/v2/latest?apikey=ecc0d4e0-85c4-11ec-8687-1f4b5599d819&base_currency=${baseCurrency}`
    )
    .then((response) => {
      // console.log(response.data.data[baseCurrency]);
      // console.log(response.data.data[quoteCurrency]);
      setConversionRate(response.data.data[quoteCurrency]);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      setIsLoading(false);
    });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <ScrollView scrollEnabled={scrollEnabled}>
        <SafeAreaView style={styles.header}>
          <TouchableOpacity onPress={() => navigation.push("Options")}>
            <Entypo name="cog" size={28} color={colors.white} />
          </TouchableOpacity>
        </SafeAreaView>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/background.png")}
              style={styles.logoBackground}
              resizeMode="contain"
            />
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.textHeader}>Kalkurs - Kalkulator Kurs</Text>
          {isLoading ? (
            <ActivityIndicator color="colors.white" size="large" />
          ) : (
            <>
              <View style={styles.inputContainer}>
                <ConversionInput
                  text={baseCurrency}
                  value={value}
                  onButtonPress={() =>
                    navigation.push("CurrencyList", {
                      title: "Base currency",
                      isBaseCurrency: true,
                    })
                  }
                  keyboardType="numeric"
                  editable={true}
                  onChangeText={(text) => setValue(text)}
                />
                <ConversionInput
                  text={quoteCurrency}
                  value={
                    value &&
                    `${(parseFloat(value) * conversionRate).toFixed(2)}`
                  }
                  editable={false}
                  onButtonPress={() =>
                    navigation.push("CurrencyList", {
                      title: "Quote Currency",
                      isBaseCurrency: false,
                    })
                  }
                />
              </View>
              <Text style={styles.text}>
                {`1 ${baseCurrency} = ${conversionRate} ${quoteCurrency} as of ${format(
                  new Date(date),
                  "MMM do, yyyy"
                )}`}
              </Text>
              <Button
                text="Reverse Currencies"
                onPress={() => swapCurrencies()}
              />
            </>
          )}

          <KeyboardSpacer onToggle={(visible) => setScrollEnabled(visible)} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: "center",
  },
  content: {
    paddingTop: screen.height * 0.1,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoBackground: {
    width: screen.width / 0.45,
    height: screen.width * 0.45,
  },
  logo: {
    position: "absolute",
    width: screen.width * 0.25,
    height: screen.height * 0.25,
  },
  textHeader: {
    color: colors.white,
    textAlign: "center",
    marginVertical: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    color: colors.white,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 10,
  },
  header: {
    alignItems: "flex-end",
    marginTop: 10,
    marginHorizontal: 20,
  },
});
