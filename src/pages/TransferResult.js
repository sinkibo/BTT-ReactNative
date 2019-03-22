import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
} from 'react-native';
import { connect } from 'react-redux';

const DWindow = Dimensions.get('window')

export class Transfer extends Component{

    constructor(props) {
        super(props);
    }

    render(){
        let {fromAccount,toAccount,amount} = this.props.navigation.state.params;
        return(
         <View style={styles.container}>
            <View><Text style={{color:'blue'}}>{this.props.message}</Text></View>
            <View style={styles.content}>
                <View style={styles.from}>
                    <Text style={styles.fromContent}>Transfer From:{fromAccount}</Text>
                    <Text style={styles.fromContent}>Transfer Amount: ${amount}</Text>
                </View>
                <View style={styles.to}>
                    <Text style={styles.toContent}>Transfer To:{toAccount}</Text>
                    <Text style={styles.toContent}>Balance: {this.props.accountToBalance}</Text>
                </View>
            </View>    
            <View style={styles.row}>
                <View style={styles.textButton}>
                    <Text style={{color:'white'}} onPress={()=> this.props.navigation.goBack()}>Back</Text>
                </View>
            </View>
         </View>
        );
    };
}

export default connect(
    (states) => ({
        message: states.transfer.message,
        accountToBalance: states.transfer.accountToBalance,
    })
)(Transfer)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
    from: {
        flex: 1,
        flexDirection: 'column',
        alignContent: 'flex-start',
        borderColor: 'orange',
        borderWidth: 2,
        margin: 5,
        borderRadius: 5,
    },
    to: {
        flex: 1,
        flexDirection: 'column',
        alignContent: 'flex-start',
        borderColor: 'green',
        borderWidth: 2,
        margin: 5,
        borderRadius: 5,
    },
    textButton: {
        height:40,
        width:DWindow.width - 10,
        backgroundColor:'cornflowerblue',
        marginTop:10,
        marginBottom:30,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5
    },
    fromContent:{
        color:'orange',
        marginTop:10,
    },
    toContent:{
        color:'green',
        marginTop:10,
    }
});