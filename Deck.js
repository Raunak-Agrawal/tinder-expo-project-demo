import React from "react";
import {
  View,
  Text,
  PanResponder,
  Animated,
  Dimensions,
  UIManager,
  LayoutAnimation
} from "react-native";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = 0.25 * width;
const SWIPE_DURATION = 250;

class Deck extends React.Component {
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {}
  };
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };
    this.position = new Animated.ValueXY();
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,

      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          this.forceSwipe("right");
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe("left");
        } else {
          this.resetPosition();
        }
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      }
    });
  }
  componentDidUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }
  forceSwipe = direction => {
    let x = direction === "right" ? width : -width;
    Animated.timing(this.position, {
      toValue: { x, y: 0 },
      duration: SWIPE_DURATION
    }).start(() => this.onSwipeComplete(direction));
  };
  onSwipeComplete = direction => {
    let { onSwipeLeft, onSwipeRight, data } = this.props;
    let item = data[this.state.index];
    direction === "right" ? onSwipeRight(item) : onSwipeLeft(item);
    this.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });
  };
  resetPosition = () => {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  };
  getCardStyle = () => {
    let { position } = this;
    console.log(width);
    const rotate = position.x.interpolate({
      inputRange: [-width * 1.5, 0, width * 1.5],
      outputRange: ["-120deg", "0deg", "120deg"]
    });
    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  };

  renderCards = () => {
    let { data, renderCard, renderNoMoreCards } = this.props;
    if (this.state.index >= data.length) {
      return renderNoMoreCards();
    }
    return data
      .map((card, i) => {
        console.log(i, this.state.index);
        if (i < this.state.index) return null;
        if (i === this.state.index) {
          return (
            <Animated.View
              key={card.id}
              {...this._panResponder.panHandlers}
              style={[this.getCardStyle(), styles.cardStyle]}
            >
              {renderCard(card)}
            </Animated.View>
          );
        }
        return (
          <Animated.View
            key={card.id}
            style={[styles.cardStyle, { top: 10 * (i - this.state.index) }]}
          >
            {renderCard(card)}
          </Animated.View>
        );
      })
      .reverse();
  };

  render() {
    return <View>{this.renderCards()}</View>;
  }
}
const styles = {
  cardStyle: {
    position: "absolute",
    width: "100%",
    zIndex: 100
  }
};
export default Deck;
