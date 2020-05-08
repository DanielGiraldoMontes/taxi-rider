import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform
} from 'react-native';
import { LoginComponent, Background, ForgotPassModal } from '../components';
import { colors } from '../common/theme';
import * as firebase from 'firebase'
import * as Facebook from 'expo-facebook';
import { Button } from 'react-native-elements';
import languageJSON from '../common/language';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from "expo-crypto";

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailValid: true,
      passwordValid: true,
      showForgotModal: false,
      emailerror: null,
    }
    console.log(Platform.OS)

  }

  closeModal() {
    this.setState({ showForgotModal: false })
  }

  //go to register page
  onPressRegister() {
    this.props.navigation.navigate('Reg');
    // console.log("register clicked");
  }

  //forgot password press
  forgotPassPress() {
    this.setState({ showForgotModal: true })
  }

  onPressForgotPass(email) {
    var auth = firebase.auth();
    return auth.sendPasswordResetEmail(email)
      .then((res) => {
        //console.log("A Password Reset Link sent to your email please check and reset your New Password")
        this.setState({ showForgotModal: false }, () => {
          setTimeout(() => {
            alert(languageJSON.forgot_password_success_messege)
          }, 600);
        });

      })
      .catch((error) => {
        alert(error)
      })
  }

  //on press login after all validation
  async onPressLogin(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(res => {
      }).catch(res => {
        alert(res.message);
      })
  }

  async FbLogin() {

    try {
      await Facebook.initializeAsync('870057920147322');
      const {
        type,
        token
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', "email"],
      });
      if (type === 'success') {

        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        firebase.auth().signInWithCredential(credential)
          .then((user) => {
            console.log('user', user)
            if (user) {
              if (user.additionalUserInfo.isNewUser == true) {
                //console.log("user found");
                var data = user.additionalUserInfo;
                this.props.navigation.navigate("Reg", { requireData: data })
              } else {
                this.props.navigation.navigate('Root');
              }
            }
          }).catch(error => {
            console.log('error', error);
            alert(languageJSON.facebook_login_error)
          }
          )
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(languageJSON.facebook_login_auth_error`${message}`);
    }
  }

   appleSigin = async () => {

    const csrf = Math.random().toString(36).substring(2, 15);
    const nonce = Math.random().toString(36).substring(2, 10);
    const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce);
    try {
      const applelogincredentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        state: csrf,
        nonce: hashedNonce
      });
      const provider = new firebase.auth.OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: applelogincredentials.identityToken,
        rawNonce: nonce,
      });
      firebase.auth().signInWithCredential(credential)
        .then((user) => {
          if (user) {
            if (user.additionalUserInfo.isNewUser == true) {
              var data = user.additionalUserInfo;
              this.props.navigation.navigate("Reg", { requireData: data })
            } else {
              this.props.navigation.navigate('Root');
            }
          }
        })
        .catch((error) => {
          alert("Apple Signin is not configured in developer.appple.com");
          console.log(error);
        });

    } catch (e) {
      if (e.code === 'ERR_CANCELED') {
          console.log("Cencelled");
      } else {
        console.log(e);
        alert("Apple Signin is not configured in developer.appple.com");
      }
    }
  }


  render() {
    return (
      <Background>
        <View style={styles.logo}>
          <Image source={require('../../assets/images/logo.png')} />
        </View>
        <View style={styles.logInCompStyl} />
        <View style={styles.containerView}>
          <LoginComponent
            complexity={'any'}
            onPressRegister={() => { this.onPressRegister() }}
            onPressLogin={(email, password) => this.onPressLogin(email, password)}
            onPressForgotPassword={() => { this.forgotPassPress() }}
          />

        </View>

        <View style={styles.facebookButtonStyle}>
          <Button
            title={languageJSON.facebook_login_button}
            loading={false}
            titleStyle={styles.fbButtonTitleStyle}
            loadingProps={{ size: "large", color: colors.BLUE.default.primary }}
            buttonStyle={styles.fbLoginButtonStyle}
            containerStyle={styles.fbLoginButtonContainer}
            onPress={() => { this.FbLogin() }}
          />
        </View>
        {Platform.OS == 'ios' ?
          <View style={styles.facebookButtonStyle2}>
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={5}
              style={{ width: 200, height: 44, elevation: 5,shadowColor: colors.BLACK,shadowRadius: 10,shadowOpacity: 0.6,hadowOffset: { width: 0, height: 4 } }}
              onPress={() => { this.appleSigin() }}
            />
          </View>
           : null} 
        <ForgotPassModal
          modalvisable={this.state.showForgotModal}
          requestmodalclose={() => { this.closeModal() }}
          inputEmail={this.state.email}
          emailerrorMsg={this.state.emailerror}
          onChangeTextInput={(value) => { this.setState({ emailerror: null, email: value }) }}
          onPressForgotPass={(email) => this.onPressForgotPass(email)}
        />


      </Background>
    );
  }
}

//Screen Styling
const styles = StyleSheet.create({
  containerView: { flex: 1.7, justifyContent: 'center', alignItems: 'center' },
  logo: {
    flex: 1,
    position: 'absolute',
    top: 80,
    width: '100%',
    justifyContent: "flex-end",
    alignItems: 'center'
  },
  logInCompStyl: {
    height: 100
  },
  facebookButtonStyle: {
    flex: 0.2,
    alignItems: "center"
  },
  facebookButtonStyle2: {
    flex: 0.4,
    alignItems: "center",
   
  },
  fbButtonTitleStyle: {
    fontSize: 16

  },
  fbLoginButtonStyle: {
    backgroundColor: colors.SKY,
    height: 44,
    width: 200,
    //borderRadius: 210 / 2,
  },
  fbLoginButtonContainer: {
    flex: 1,
    elevation: 5,
    shadowColor: colors.BLACK,
    shadowRadius: 10,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 4 }
  },
});
