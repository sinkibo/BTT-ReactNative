import React,{Component} from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import * as myAccountAction from '../actions/myAccountAction';

let page = 1;
let data = [];

export class MyAccount extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
          })
        };
    }

    componentWillMount(){
        this.props.loadData();
    }

    reloadWordData() {
        this.props.loadData();
    }
    
    static navigationOptions = {
        tabBarLabel: 'MyAccount',
        tabBarIcon: ({focused}) => {
            if (focused) {
                return (
                    <Image style={styles.tabBarIcon} source={require('../img/myaccount_a.png')}/>
                );
            }
            return (
                <Image style={styles.tabBarIcon} source={require('../img/myaccount.png')}/>
            );
        },
    };

    render(){
        const { dataSource, loaded} = this.props; 

        if(!this.props.isLoggedIn){
            return (<View style={styles.container}><Text style={{color:'red'}}>{"Please login first!"}</Text></View>)
        }

        if (!loaded) {
            if(this.props.status == "loadData-error" )
                return this.renderMessageView();
            else
                return this.renderLoadingView();
        }

        return (
            <ListView
               refreshControl={
                <RefreshControl
                    refreshing={false}
                    onRefresh={this.reloadWordData.bind(this)}
                />}
                dataSource= {dataSource}
                renderRow={this.renderRow.bind(this)}
                style={styles.listView}
                onEndReached={this.onEndReached.bind(this)}
                onEndReachedThreshold = { 100 }
                renderSeparator={this._renderSeparator.bind(this)}
            />
        );
    };
    onEndReached() {
        this.loadMore();
    }

    loadMore() {
        this.props.loadData();
    }
  
    renderLoadingView(){
        return (<View style={styles.container} >
                  <Text>Loading ......</Text>
              </View>
        );
    }

    renderMessageView(){
        return (<View style={styles.container} >
                  <Text style={{color:'blue'}}>{this.props.message}</Text>
              </View>
        );
    }

    _pressRow(rowID,history){
        this.props.navigation.navigate('MyAccountDetail',{item:rowID/*,data:history*/});
    }

    _renderSeparator() {
        return (
            <View style={styles.separator}></View>
        )
    }
  
    renderRow(row) {
        return (
          <TouchableHighlight onPress={() => this._pressRow(row.card_id, row.historyList)}>
              <View style={styles.container}>
                  <Image
                      source={require('../img/big.jpg')}
                      style={styles.thumbnail}
                  />
                  <View style={styles.rightContainer}>
                      <Text style={styles.id}>{row.card_id}</Text>
                      <Text style={row.card_type == 'credit' ? styles.type_red : styles.type}>{row.card_type}</Text>
                      <Text style={styles.balance}>{row.balance}</Text>
                  </View>
              </View>
          </TouchableHighlight>
        );
 
    }
}

export default connect(
    (states) => ({
        isLoggedIn: states.loginIn.user.isLoggedIn,
        status: states.myAccount.status,
        loaded: states.myAccount.loaded,
        cardList: states.myAccount.cardList,
        total_balance: states.myAccount.total_balance,
        message: states.myAccount.message,
        dataSource: states.myAccount.dataSource,
    }),
    (dispatch) => ({
        loadData: () => dispatch(myAccountAction.initAction()),
    })
)(MyAccount)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    thumbnail: {
        width: 25,
        height: 25,
        marginLeft:30,
    },
    rightContainer: {
        flexDirection: 'row',
        flex: 1,
        marginRight:30,
    },
    id: {
        fontSize: 18,
        textAlign: 'center',
        color: 'blue',
        flex: 1,
    },
    type_red: {
        textAlign: 'center',
        color: 'red',
        flex: 1,
    },
    type: {
        textAlign: 'center',
        color: 'cornflowerblue',
        flex: 1,
    },
    balance: {
        textAlign: 'left',
        color: 'green',
        flex: 1,
    },
    listView: {
        paddingTop: 20,
        backgroundColor: '#F5FCFF',
    },
    tabBarIcon: {
        width: 21,
        height: 21,
    },
    separator: {
        height:1,
        backgroundColor:'cornflowerblue'
    }
});