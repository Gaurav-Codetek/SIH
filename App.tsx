import { StyleSheet, Text, View } from "react-native";
import StackNavigator from "./navigation/StackNavigator";
// import Timer from "./components/Main";
// import { Provider } from "react-redux";
export default function App() {
  return (
        <>
          <StackNavigator />
          {/* <Timer/> */}
        </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

