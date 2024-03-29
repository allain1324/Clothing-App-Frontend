import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { COLOURS, Items } from "../service/dbNhat.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Entypo from "react-native-vector-icons/Entypo";
import Ionic from "react-native-vector-icons/Ionicons";
import colors from "../assets/colors.js";
import Loading from "../components/Loading.js";
import SplashScreen from "react-native-splash-screen";
import { addItem } from "../redux/shopping-cart/cartItemsSlice.js";
import { useDispatch } from "react-redux";
const axios = require("axios").default;

const ProductInfo = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const productID = route.params.productID;
  const width = Dimensions.get("window").width;
  const scrollX = new Animated.Value(0);
  let rate = route.params.rate;
  let position = Animated.divide(scrollX, width);

  let [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  let rates = [1, 1, 1, 1, 1];
  let [icon, setIcon] = useState("heart");
  const [selectedSize, setSelectSize] = useState(0);
  const changeNameIcon = () => {
    if (icon === "heart") {
      setIcon("heart-outline");
    } else {
      setIcon("heart");
    }
  };
  const addToCart = async () => {
    dispatch(
      addItem({
        nameProduct: product.product.nameProduct,
        detail_product_id: product.size[selectedSize].id,
        size: product.size[selectedSize].size,
        quantity: 1,
        price: product.product.price,
        image: product.images[0].url,
        colorHex: product.product.colorHex,
        color: product.product.color,
      })
    );
  };

  const getRate = () => {
    let arrRate = [];
    do {
      arrRate.push(1);
      rate = rate - 1;
    } while (rate > 0.5);
    if (rate == 0.5) arrRate.push(0.5);
    arrRate = arrRate.concat(new Array(5 - arrRate.length).fill(0));
    rates = arrRate;
  };

  const getProductFromDatabase = async () => {
    axios
      .get(`http://192.168.1.11:5500/api/product/${productID}`)
      .then(function (response) {
        // handle success
        console.log(response.data);
        setProduct(response.data);
        SplashScreen.hide();
        setIsLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  useEffect(() => {
    getProductFromDatabase();
  }, [navigation]);

  getRate();
  const renderProduct = ({ item, index }) => {
    console.log("item", item);
    return (
      <View
        style={{
          width: width,
          height: 240,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={{ uri: `http://192.168.1.11:5500/${item.url}` }}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
        />
        <StatusBar
          backgroundColor={COLOURS.backgroundLight}
          barStyles="dark-content"
        />
      </View>
    );
  };

  return (
    <View
      width="100%"
      height="100%"
      backgroundColor={COLOURS.white}
      position="relative"
    >
      {!isLoading ? (
        <>
          <View
            style={{
              width: "100%",
              backgroundColor: "#eceff1",
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 20,
              position: "relative",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 16,
                paddingLeft: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack("Home");
                }}
              >
                <Entypo
                  name="chevron-left"
                  style={{
                    fontSize: 18,
                    color: COLOURS.backgroundDark,
                    padding: 12,
                    backgroundColor: COLOURS.white,
                    borderRadius: 10,
                  }}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={product.images ? product.images : null}
              horizontal
              snapToInterval={width} //Trượt 1 khoảng bằng độ rộng màn hình
              decelerationRate={0.8} //Tốc độ cuộn
              renderItem={renderProduct}
              showsHorizontalScrollIndicator={false} // Ẩn thanh trượt
              bounces={true}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
            />
            <View
            key={product.images}
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                marginTop: 32,
              }}
            >
              {product.images
                ? product.images.map((data, index) => {
                    let opacity = position.interpolate({
                      inputRange: [
                        index - 2,
                        index - 1,
                        index,
                        index + 1,
                        index + 2,
                      ],
                      outputRange: [0.2, 0.2, 1, 0.2, 0.2],
                      extradata: "clamp",
                    });
                    return (
                      <Animated.View
                        key={index}
                        style={{
                          width: "16%",
                          height: 3.4,
                          backgroundColor: COLOURS.black,
                          opacity,
                          marginHorizontal: 4,
                          borderRadius: 100,
                        }}
                      ></Animated.View>
                    );
                  })
                : null}
            </View>
          </View>
          <View
            style={{
              width: "90%",
              // backgroundColor: "red",
              marginLeft: "auto",
              marginRight: "auto",
              position: "relative",
              height: 350,
            }}
          >
            <ScrollView>
              <View
                style={{
                  width: "90%",
                  // backgroundColor: "red",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 7,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      width: 240,
                      fontFamily: "Macondo-Regular",
                    }}
                  >
                    {product.product.nameProduct}
                  </Text>
                  <TouchableOpacity onPress={changeNameIcon}>
                    <Ionic name={icon} style={{ fontSize: 20 }} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    marginTop: 7,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {product.product.price} VND
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ flexDirection: "row" }}>
                      {rates.map((item) => {
                        let name =
                          item == 1
                            ? "star"
                            : item == 0.5
                            ? "star-half-outline"
                            : "star-outline";
                        return <Ionic name={name} style={{ fontSize: 17 }} />;
                      })}
                    </View>
                    <Text style={{ marginLeft: 7 }}>{product.rate}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 15 }}>
                  <Text style={{ marginBottom: 10, fontWeight: "bold" }}>
                    Size
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      alignItems: "space-between",
                      justifyContent: "space-around",
                    }}
                  >
                    {product.size
                      ? product.size.map((item, index) => {
                          console.log("hehe", product.size);
                          return (
                            <TouchableOpacity
                              key={index}
                              disabled={
                                product.size[
                                  Object.keys(product.size)[index]
                                ] == 0
                                  ? true
                                  : false
                              }
                              onPress={() => {
                                if (
                                  product.size[
                                    Object.keys(product.size)[index]
                                  ] != 0
                                ) {
                                  console.log("index", index);
                                  setSelectSize(index);
                                }
                              }}
                            >
                              <Text
                                style={{
                                  width: 50,
                                  height: 50,
                                  textDecorationLine:
                                    product.size[
                                      Object.keys(product.size)[index]
                                    ] == 0
                                      ? "line-through"
                                      : "none",
                                  backgroundColor:
                                    product.size[
                                      Object.keys(product.size)[index]
                                    ] == 0
                                      ? colors.ligthGray
                                      : "#e5eddf",
                                  borderRadius: 10,
                                  textAlign: "center",
                                  lineHeight: 50,
                                  fontWeight: "bold",
                                  borderWidth: index == selectedSize ? 3 : 0,
                                  color:
                                    product.size[
                                      Object.keys(product.size)[index]
                                    ] == 0
                                      ? colors.gray
                                      : colors.black,
                                }}
                              >
                                {item.size}
                              </Text>
                            </TouchableOpacity>
                          );
                        })
                      : null}
                  </View>
                </View>
                <View
                  style={{
                    marginTop: 13,
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ fontWeight: "bold", marginBottom: 7 }}>
                    Số lượng còn:
                  </Text>
                  <Text>
                    {"    "}
                    {product.size[selectedSize].quantity}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 13,
                  }}
                >
                  <Text
                    flexDirection="column"
                    style={{ fontWeight: "bold", marginBottom: 7 }}
                  >
                    Mô tả
                  </Text>
                  <Text>{product.product.descProduct}</Text>
                </View>
              </View>
            </ScrollView>
            <TouchableOpacity
              onPress={() => {
                addToCart();
              }}
            >
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 50,
                  backgroundColor: COLOURS.black,
                  borderRadius: 10,
                  position: "absolute",
                  bottom: 10,
                  width: "100%",
                }}
              >
                <Text style={{ fontSize: 20, color: COLOURS.white }}>
                  Thêm vào giỏ
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Loading type="loading" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "50%",
  },
});

export default ProductInfo;
