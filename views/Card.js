import React, {Component} from 'react';
import {Text, View, StyleSheet, ImageBackground} from 'react-native';

export default class Card extends Component {
  render() {
    return (
          <ImageBackground source={this.props.imageFile} style={styles.card} >

          </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: 350,
    height: 380,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderColor:'gray',
    borderWidth:1,
    overflow:'hidden'
  },
  image: {
    height: 350,
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
});
