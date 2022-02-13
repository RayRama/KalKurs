import React, { useContext } from "react";
import { StatusBar, View, FlatList, StyleSheet } from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";

import currencies from "../data/currencies.json";
import colors from "../constants/colors";
import { RowItem, RowSeparator } from "../components/rowItem";
import { ConversionContext } from "../util/conversionContext";

export default ({ navigation, route = {} }) => {
  const {
    baseCurrency,
    quoteCurrency,
    setBaseCurrency,
    setQuoteCurrency,
    swapCurrencies,
  } = useContext(ConversionContext);

  const insets = useSafeArea();
  const params = route.params || {};
  const { isBaseCurrency } = params;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <FlatList
        data={currencies}
        renderItem={({ item }) => {
          const regex = /[A-Z]{3}/;
          const itemRegex = item.match(regex);

          // const selected = activeCurrency === itemRegex[0];
          let selected = false;

          if (isBaseCurrency && itemRegex[0] === baseCurrency) {
            selected = true;
          } else if (!isBaseCurrency && itemRegex[0] === quoteCurrency) {
            selected = true;
          }

          return (
            <RowItem
              title={item}
              onPress={() => {
                if (isBaseCurrency) {
                  setBaseCurrency(itemRegex[0]);
                } else {
                  setQuoteCurrency(itemRegex[0]);
                }
                navigation.pop();
              }}
              rightIcon={
                selected && (
                  <View style={styles.icon}>
                    <Entypo name="check" size={18} color={colors.white} />
                  </View>
                )
              }
            />
          );
        }}
        keyExtractor={(item) => item}
        ItemSeparatorComponent={() => <RowSeparator />}
        ListFooterComponent={() => (
          <View style={{ paddingBottom: insets.bottom }} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.black,
  },
});
