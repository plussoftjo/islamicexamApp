import React, { useRef } from "react";
import { View, ScrollView, TouchableOpacity, Animated, } from "react-native";
import { Layout, Text, Button, useTheme } from "@ui-kitten/components";
import { connect } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { SettingsActions } from "../../../../stores";
import { Header } from "./AuthPage/index.js";
import BottomSheet from "reanimated-bottom-sheet";
import {translate} from '../../../../translations'
import {NotificationHandler} from '../Components'
let AuthPage = (props) => {
  /**
   * Props
   */
  let { navigation, setCategory } = props;
  let { user, userResults } = props.user;
  let { categories } = props.settings;
  let [selectedIndex, setSelectedIndex] = React.useState(0);
  const sheetRef = React.useRef(null);
  let theme = useTheme();

  /**
   * Methods
   */
  let StartTheQuestions = () => {
    setCategory(categories[selectedIndex]);
    navigation.navigate("Questions");
  };

  let _LastResults = () => {
    let _userResultsLength = userResults.length - 1;
    return userResults[_userResultsLength];
  };

  /**
   * Content Animations ForCategories
   */
  let CategoriesBox = useRef(new Animated.Value(-500)).current;
  let CategoriesBoxEnter = () => {
    Animated.timing(CategoriesBox, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  let StartBox = useRef(new Animated.Value(0.5)).current;
  let StartBoxEnter = () => {
    Animated.timing(StartBox, {
      toValue: 1.1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      Animated.timing(StartBox, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1001);
  };

  let Content = () => (
    <View style={{ paddingTop: 10, paddingHorizontal: 15 }}>
      <Text
        category="h5"
        style={{ color: theme["color-info-700"], textAlign: "left" }}
      >
        {translate("main.select_type")}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 5,
          flexWrap: "wrap",
        }}
      >
        {categories.map((category, index) => (
          <Animated.View
            key={index}
            style={{
              transform: [{ translateX: CategoriesBox }],
              width: "45%",
              paddingVertical: 15,
              marginHorizontal: 5,
              borderRadius: 10,
              borderColor: theme["color-info-500"],
              borderWidth: 1,
              marginTop:5,
              backgroundColor:
                selectedIndex == index
                  ? theme["color-info-600"]
                  : theme["color-info-400"],
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setSelectedIndex(index);
              }}
              style={{ width: "100%" }}
            >
              <Text
                category="s1"
                style={{
                  color: "white",
                  textAlign: "center",
                  fontFamily: "CairoBold",
                }}
              >
                {category.title}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom:5
        }}
      >
        <Animated.View style={{ transform: [{ scale: StartBox }] }}>
          <Button
            onPress={StartTheQuestions}
            appearance="filled"
            status="success"
            style={{ height: 100, width: 100, borderRadius: 50 }}
          >
            {translate("main.start")}
          </Button>
        </Animated.View>
      </View>
    </View>
  );

  let loginContentAnimation = useRef(new Animated.Value(0)).current;
  let loginContentAnimationEnter = () => {
    Animated.timing(loginContentAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  let ResultsContent = () => (
    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          flex: 1,
          borderColor: "#7e7e7e",
          borderWidth: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text category="h5" style={{ fontFamily: "CairoBold" }}>
        {translate("main.last_result")}
        </Text>
        {userResults.length >= 1 && (
          <Text category="s1" style={{ fontFamily: "CairoBold" }}>
            {_LastResults().results} / {_LastResults().questions}
          </Text>
        )}
      </View>
      <View
        style={{
          flex: 1,
          borderColor: "#7e7e7e",
          borderWidth: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text category="h5" style={{ fontFamily: "CairoBold" }}>
        {translate("main.all_quiz")}
        </Text>
        {userResults.length >= 1 && (
          <Text category="s1" style={{ fontFamily: "CairoBold" }}>
            {userResults.length}
          </Text>
        )}
      </View>
    </View>
  );

  React.useEffect(() => {
    CategoriesBoxEnter();
    StartBoxEnter();
    loginContentAnimationEnter();
  }, []);
  return (
    <Layout style={{ flex: 1 }}>
      <LinearGradient
        // Button Linear Gradient
        colors={[theme["color-success-500"], theme["color-warning-500"]]}
        start={{ x: 0.3, y: 0.2 }}
        end={{ x: 0.9, y: 0.6 }}
        style={{ flex: 1 }}
      >
      <ScrollView showsVerticalScrollIndicator={false}>
      <Header translate={translate}  />
        <Content />
        <ResultsContent />
        <NotificationHandler/>
      </ScrollView>
        
      </LinearGradient>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCategory: (item) => dispatch(SettingsActions.setCategory(item)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage);
