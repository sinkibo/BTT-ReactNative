import React from 'react';
import Home from './pages/Home.js';
import MyAccount from './pages/MyAccount.js';
import MyAccountDetail from './pages/MyAccountDetail.js';
import TransferResult from './pages/TransferResult.js';
import {TabNav} from './TabNavigator.js'
import Login from './pages/Login.js';
import Transfer from './pages/Transfer.js';
import {createStackNavigator,createDrawerNavigator,createAppContainer} from 'react-navigation';
import {
    Image,
    StyleSheet,
} from 'react-native';

const Stack = createStackNavigator({ 
    Transfer: {screen: Transfer},
    MyAccount: {screen: MyAccount}, 
    MyAccountDetail: {screen: MyAccountDetail}, 
    TransferResult: {screen: TransferResult},
    Home: {screen: Home}, 
    Login: {screen: Login}, 
    Main: {
        screen: TabNav,
        navigationOptions: ({navigation}) => {
            //header: null
            //navigation.navigate("Login");
        }
    }
  },
  {
    initialRouteName: 'Main',
    headerMode: 'screen'
  });

/**
 * side bar
 */
const MyDrawerNavigator = createDrawerNavigator({
    BTT: {
        screen: Stack,
        navigationOptions: {
            drawerLabel: 'BTT React Native',
            drawerIcon: ({tintColor}) => (
                <Image
                    source={require('./img/logo-btt.png')}
                    style={[styles.icon, {tintColor: tintColor}]}
                />
            ),
        }
    },
    Home: {
        screen: Home,
        navigationOptions: {
            drawerLabel: 'Home',
            drawerIcon: ({tintColor}) => (
                <Image
                    source={require('./img/home.png')}
                    style={[styles.icon, {tintColor: tintColor}]}
                />
            ),
        }
    },
    MyAccount: {
        screen: MyAccount,
        navigationOptions: {
            drawerLabel: 'MyAccounts',
            drawerIcon: ({tintColor}) => (
                <Image
                    source={require('./img/myaccount.png')}
                    style={[styles.icon, {tintColor: tintColor}]}
                />
            ),
        },
        /*tabBarOnPress: (scene) => {
            if(!this.props.isLoggedIn){
                scene.navigation.navigate("Login");
            }
        },*/
    },
    Transfer: {
        screen: Transfer,
        navigationOptions: {
            drawerLabel: 'Transfer',
            drawerIcon: ({tintColor}) => (
                <Image
                    source={require('./img/transfer.png')}
                    style={[styles.icon, {tintColor: tintColor}]}
                />
            ),
        }
    },
    Login: {
        screen: Login,
        navigationOptions: {
            drawerLabel: 'Login',
            drawerIcon: ({tintColor}) => (
                <Image
                    source={require('./img/login.png')}
                    style={[styles.icon, {tintColor: tintColor}]}
                />
            ),
        }
    },

}, {
    drawerWidth: 250, // 展示的宽度
    drawerPosition: 'left', // 抽屉在左边还是右边
     contentOptions: {
         //activeTintColor: 'red',  // 选中文字颜色
         activeBackgroundColor: '#fff', // 选中背景颜色
         // inactiveTintColor: 'cornflowerblue',  // 未选中文字颜色
         //inactiveBackgroundColor: 'black', // 未选中背景颜色
         style: {  // 样式
    
         }
    },
});

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
    }
});
export default APP = createAppContainer(MyDrawerNavigator);