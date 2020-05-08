import React from 'react';
import {Registration } from '../components';
import {StyleSheet,View} from 'react-native';
import * as firebase from 'firebase'
import  languageJSON  from '../common/language';

export default class RegistrationPage extends React.Component {
  login;
    constructor(props){
        super(props);
        this.state = {
          loading: false,
          allRegData:""
        }
        this.login = false;
        //firebase.auth().signOut();
    }

    
    async clickRegister(fname, lname, email, mobile, password,viaRef,referralVia) {
        this.setState({loading: true})
        var regData = {
          firstName:fname,
          lastName:lname,
          mobile:mobile,
          email:email,
          usertype:'rider',
          signupViaReferral:viaRef,
          referarDetails:referralVia,
          createdAt:new Date().toISOString()
          
        }  
        //console.log(firebase.auth().currentUser)
               // console.log("registration data===>",regData)
                //  Registration part
                if(firebase.auth().currentUser){
                  //console.log(firebase.auth().currentUser)
                          var credential = firebase.auth.EmailAuthProvider.credential(email, password);
                          firebase.auth().currentUser.linkWithCredential(credential).then((usercred)=> {
                            var user = usercred.user;
                          if(user){
                            firebase.auth().currentUser.updateProfile({
                            displayName:regData.firstName + ' '+ regData.lastName,
                            }).then(()=>{
                             
                            firebase.database().ref('users/').child(firebase.auth().currentUser.uid).set(regData).then(()=>{
                                firebase.auth().signInWithEmailAndPassword(email,password)
                                .then( res => {
                                  this.props.navigation.navigate('Root'); 
                                }).catch(res=>{
                                  alert(res.message);
                                })
                            })
                          });
                          }
                          }).catch(error=>{
                            alert(languageJSON.Account_linking_error, error);
                  });
                }else{
                    firebase.auth().createUserWithEmailAndPassword(email,password).then((newUser)=>{
                      if(newUser){
                       
                        firebase.auth().currentUser.updateProfile({
                          displayName:regData.firstName + ' '+ regData.lastName,
                        }).then(()=>{
                          firebase.database().ref('users/').child(firebase.auth().currentUser.uid).set(regData).then(()=>{
                              firebase.auth().signInWithEmailAndPassword(email,password)
                              .then( res => {
                                console.log(firebase.auth().currentUser)
                                this.props.navigation.navigate('Root'); 
                              }).catch(res=>{
                                alert(res.message);
                              })
                          })
                        });
                      }
                    }).catch((error)=>{
                      var errorMessage = error.message;
                      console.log(errorMessage);
                      this.setState({loading:false},()=>{
                        alert(languageJSON.email_exist_error);
                      })
                    }); 
                }


    }

  
    
  render() {
    const registrationData= this.props.navigation.getParam("requireData");
    // console.log(registrationData);
    return (
        <View style={styles.containerView}>
            <Registration reqData={registrationData?registrationData:""} complexity={'any'} onPressRegister={(fname, lname, email, mobile, password,viaRef,referralVia)=>this.clickRegister(fname, lname, email, mobile, password,viaRef,referralVia)}  onPress={()=>{this.clickRegister()}} onPressBack={()=>{this.props.navigation.goBack()}} loading={this.state.loading}></Registration>
        </View>
    );
  }
}
const styles = StyleSheet.create({
    containerView:{ flex:1 },
    textContainer:{textAlign:"center"},
});
