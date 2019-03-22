import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';
import * as loginAction from '../actions/loginAction';

var Dimensions = require('Dimensions');
var width = Dimensions.get('window').width;

class Login extends Component{

    constructor(props) {
        super(props);
        this.state = {
            account: this.props.account,
            password: this.props.password
        }
    }

      
    static navigationOptions = {
        tabBarLabel: 'Login',
        tabBarIcon: ({focused}) => {
            if (focused) {
                return (
                    <Image style={styles.tabBarIcon} source={require('../img/login_a.png')}/>
                );
            }
            return (
                <Image style={styles.tabBarIcon} source={require('../img/login.png')}/>
            );
        },
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.status !== nextProps.status && nextProps.status === 'login-success' && nextProps.isSuccess) {
          this.props.navigation.navigate('MyAccount');
        }
        return true;
    }

    render(){
        const { login,logout } = this.props;  
        if(this.props.isLoggedIn){
            return (
                <View style={styles.container}>
                    <Image source={this.props.gender == "M" ? require('../img/man.jpg') : require('../img/woman.jpg')} style={styles.iconStyle}/>
                    
                    <Text>Welcome {this.props.username} !</Text>
                    
                    <TouchableOpacity onPress={()=> logout()} style={{marginTop: 50}}>
                        <View style={styles.loginBtnStyle}>
                            <Text style={{color:'white'}}>Logout</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.message}>
                    {
                        this.props.message
                    }
                    </Text>
                </View>
            );
        }else{
            return (
                <View style={styles.container}>
                    
                    {/*{头像}*/}
                    <Image source={require('../img/logo-btt.png')} style={styles.iconStyle}/>
                    {/*账号和密码*/}
                    <TextInput placeholder={'Enter name'}
                               style={styles.textInputStyle}
                               defaultValue={this.props.account}
                               maxLength={20}
                               onChangeText={(account) => this.setState({account})}
                    />
                    <TextInput placeholder={'Enter password'}
                               style={styles.textInputStyle}
                               secureTextEntry={true}
                               defaultValue={this.props.password}
                               maxLength={20}
                               onChangeText={(password) => this.setState({password})}
                    />
                    {/*登录*/}
                    <TouchableOpacity onPress={()=> login(this.state.account,this.state.password )} style={{marginTop: 50}}>
                        <View style={styles.loginBtnStyle}>
                            <Text style={{color:'white'}}>Login</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.message}>
                    {
                        this.props.message
                    }
                    </Text>
                </View>
            );
        } 
    }
}

export default connect(
    (states) => ({
        status: states.loginIn.status,
        isSuccess: states.loginIn.isSuccess,
        isLoggedIn: states.loginIn.user.isLoggedIn,
        account: states.loginIn.user.account_id,
        password: states.loginIn.user.password,
        message: states.loginIn.message,
        username: states.loginIn.user.name,
        gender: states.loginIn.user.gender,
    }),
    (dispatch) => ({
        login: (account,password) => dispatch(loginAction.login(account,password)),
        logout: () => dispatch(loginAction.logout()),
    })
)(Login)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    iconStyle:{
        width:80,
        height:80,
        marginTop:50,
        borderRadius:40,
        borderWidth:2,
        borderColor:'white',
        marginBottom:30,
    },
    textInputStyle:{
        backgroundColor:'white',
        width:width,
        height:40,
        marginBottom:1,
        textAlign:'center',
        paddingLeft:15,
    },
    loginBtnStyle:{
        height:40,
        width:width*0.8,
        backgroundColor:'cornflowerblue',
        marginTop:30,
        marginBottom:30,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:8
    },
    tabBarIcon: {
        width: 21,
        height: 21,
    },
    message: {
        color: 'cornflowerblue'
    },
});