import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
} from 'react-native';
import { connect } from 'react-redux';
import * as myAccountDetailAction from '../actions/myAccountDetailAction';

export class MyAccountDetail extends Component{
    constructor(props){
        super(props);
        let {item} = this.props.navigation.state.params;
        this.state = {
            id: item,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        };
    }

    componentDidMount(){
        /*let {data} = this.props.navigation.state.params;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(data),
        })*/
        this.props.loadData(this.state.id);
    }

    render(){
        const { dataSource, loaded} = this.props; 

        if (!loaded) {
            return this.renderLoadingView();
        }

        return (
            <View style={styles.main}>
                <Text style={styles.title}>Account {this.state.id} transaction Detail</Text>
                <ListView
                    dataSource= {dataSource}
                    renderRow={this.renderRow.bind(this)}
                    style={styles.listView}
                    renderSeparator={this._renderSeparator.bind(this)}
                    removeClippedSubviews={false}
                />
            </View>
            
        );
    }

    renderLoadingView(){
        return (<View style={styles.container} >
                  <Text>Loading ......</Text>
              </View>
        );
    }

    renderRow(row) {
        return (
            <View style={styles.container}>
                <View style={styles.rightContainer}>
                    <Text style={styles.id}>{this.formatDate(row.date)}</Text>
                    <Text style={styles.amount}>{row.amount}</Text>
                    <Text style={(row.amount+'').indexOf('-')>-1 ? styles.type_red : styles.type_green}>{(row.amount+'').indexOf('-')>-1 ? "outcome" : "income"}</Text>
                    <Text style={styles.name}>{row.name}</Text>
                </View>
            </View>
        );
 
    }

    formatDate(val){
        var value=new Date(val);
        var year=value.getFullYear();
        var month=this._padDate(value.getMonth()+1);
        var day=this._padDate(value.getDate());
        var hour=this._padDate(value.getHours());
        var minutes=this._padDate(value.getMinutes());
        var seconds=this._padDate(value.getSeconds());
        return year+'-'+month+'-'+day;
    }

    _padDate(va){
        va=va<10?'0'+va:va;
        return va
    }

    _renderSeparator() {
        return (
            <View style={styles.separator}></View>
        )
    }

}

export default connect(
    (states) => ({
        status: states.myAccountDetail.status,
        loaded: states.myAccountDetail.loaded,
        cardId: states.myAccountDetail.cardId,
        total: states.myAccountDetail.total,
        message: states.myAccountDetail.message,
        dataSource: states.myAccountDetail.dataSource,
    }),
    (dispatch) => ({
        loadData: (id) => dispatch(myAccountDetailAction.getDetail(id)),
    })
)(MyAccountDetail)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightContainer: {
        flexDirection: 'row',
        flex: 1,
        marginRight:30,
    },
    id: {
        textAlign: 'center',
        color: 'blue',
        flex: 1,
    },
    amount: {
        textAlign: 'left',
        color: 'black',
        flex: 1,
    },
    type_red: {
        textAlign: 'right',
        color: 'red',
        flex: 1,
    },
    type_green: {
        textAlign: 'right',
        color: 'green',
        flex: 1,
    },
    name: {
        textAlign: 'right',
        color: 'brown',
        flex: 1,
    },
    separator: {
        height:1,
        backgroundColor:'cornflowerblue'
    },
    listView: {
        marginTop: 20,
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        color: 'purple',
        paddingTop: 20,
        backgroundColor: '#F5FCFF',
    },
    main: {
        backgroundColor: '#F5FCFF',
        flex: 1,
    }
});