import React, { Component } from "react";
import { View, StyleSheet, Animated } from "react-native";

class Ball extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.position = new Animated.ValueXY(0, 0);
    Animated.timing(this.position, {
      toValue: { x: 200, y: 500 }
    }).start();
  }

  render() {
    console.log("RENDER");
    return (
      <Animated.View style={this.position.getLayout()}>
        <View style={styles.ball}></View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  ball: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "black"
  }
});
export default Ball;
