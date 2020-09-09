import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import Card from './views/Card';

export default class App extends Component {
  state = {
    pan: new Animated.ValueXY({x: 0, y: 0}),
    cardsStackedAnim: new Animated.Value(0), // add this statement
    currentIndex: 0, // and this to track card positions
  };

  images = [
    require('./assets/background12.jpg'),
    require('./assets/background13.jpg'),
    require('./assets/background14.jpg'),
  ];

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderStart: () => {},
      onPanResponderMove: (evt, gestureState) => {
        Animated.event([null, {dx: this.state.pan.x, dy: this.state.pan.y}])(
          evt,
          gestureState,
        );
      },
      onPanResponderRelease: (evt, gestureState) => {
        Animated.timing(this.state.pan, {
          toValue: {x: gestureState.dx * 3, y: gestureState.dy * 3},
          duration: 300,
        }).start();
        // will be used to interpolate values in each view
        Animated.timing(this.state.cardsStackedAnim, {
          toValue: 1,
          duration: 300,
        }).start(() => {
          // reset cardsStackedAnim's value to 0 when animation ends
          this.state.cardsStackedAnim.setValue(0);
          // increment card position when animation ends
          this.setState({
            currentIndex: this.state.currentIndex + 1,
          });
          this.state.pan.setValue({x: 0, y: 0});
        });
      },
    });
  }
  styleInterpolate(outputRange) {
    return this.state.cardsStackedAnim.interpolate({
      inputRange: [0, 1],
      outputRange,
    });
  }
  render() {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
          <View style={styles.CardsContainer}>
            <Animated.View
              style={[
                styles.fixedPos,
                {
                  opacity: this.styleInterpolate([0.3, 0.6]),
                  bottom: this.styleInterpolate([-32, -16]),
                  scaleX: this.styleInterpolate([0.85, 0.95]),
                  zIndex: 1,
                },
              ]}>
              <Card
                imageFile={this.images[(this.state.currentIndex + 2) % 3]}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.fixedPos,
                {
                  opacity: this.styleInterpolate([0.6, 1]),
                  bottom: this.styleInterpolate([-16, 0]),
                  scaleX: this.styleInterpolate([0.95, 1]),
                  zIndex: 2,
                },
              ]}>
              <Card
                imageFile={this.images[(this.state.currentIndex + 1) % 3]}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.fixedPos,
                {
                  opacity: this.state.cardsStackedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.3],
                  }),
                  scale: this.state.cardsStackedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.85],
                  }),
                  bottom: this.state.cardsStackedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -32],
                  }),
                  zIndex: this.state.cardsStackedAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [3, 2, 0],
                  }),
                  transform: [
                    {translateX: this.state.pan.x},
                    {translateY: this.state.pan.y},
                  ],
                },
              ]}
              {...this._panResponder.panHandlers}>
              <Card imageFile={this.images[this.state.currentIndex % 3]} />
            </Animated.View>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f3f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CardsContainer: {
    width: 350,
    height: 380,
  },
  fixedPos: {
    position: 'absolute',
  },
});
