import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

import * as firebase from 'firebase'
import { Notifications } from 'expo';
import GetPushToken from '../common/GetPushToken';
import { Audio } from 'expo-av';


export class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  bootstrapAsync =  () => {
    firebase.auth().onAuthStateChanged((user)=>{
      if(user && user.displayName){
        const userData = firebase.database().ref('users/'+user.uid);
        userData.once('value',userData=>{
          if(userData.val() && userData.val().usertype == 'rider'){
                      this.props.navigation.navigate('Root'); 
                      GetPushToken();
                     }
                     else{ 
                      this.props.navigation.navigate('Auth');
                     }
        })
      }else{
              this.props.navigation.navigate('Auth');
            }
    })

  };


  componentDidMount(){
    
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = async (notification) => {
    alert(notification.data.msg);

    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('../../assets/sounds/car_horn.wav'));
      await soundObject.playAsync();
    } catch (error) {
      console.log("Unable to play shound");
    }
   };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.IndicatorStyle}>
        <ActivityIndicator  size="large" />
      </View>
    );
  }
}

//Screen Styling
const styles = StyleSheet.create({
  IndicatorStyle:{
    flex:1, 
    justifyContent:"center"
  }
})