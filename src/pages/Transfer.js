import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    TextInput,
    View,
    Dimensions,
    Picker,
    Platform,
} from 'react-native';
import { connect } from 'react-redux';
import * as transferAction from '../actions/transferAction';

const DWindow = Dimensions.get('window')

export class Transfer extends Component{

    constructor(props) {
        super(props);
        this.state = {
            accountFrom: 'Please Select',
            accountTo:'Please Select',
            amount:0,
            message:'',
        }
    }

    static navigationOptions = {
        tabBarLabel: 'Transfer',
        tabBarIcon: ({focused}) => {
            if (focused) {
                return (
                    <Image style={styles.tabBarIcon} source={require('../img/transfer_a.png')}/>
                );
            }
            return (
                <Image style={styles.tabBarIcon} source={require('../img/transfer.png')}/>
            );
        },
    };

    componentWillMount(){
        this.props.loadData();
    }

    onAccountFromChange = (value) => {
        this.setState({"accountFrom":value});
    }

    onAccountToChange = (value) => {
        this.setState({"accountTo":value});
    }

    onTextChange = (text) => {
        this.setState({"amount" : text});
    }

    onPress = ()=> this.judgeAndtransfer(this.props.cardList,this.state.accountFrom,this.state.accountTo,this.state.amount );
   
    render(){

        const { cardList } = this.props; 
        const { accountFrom, accountTo} = this.state;

        if(!this.props.isLoggedIn){
            return (<View style={styles.container}><Text style={{color:'red'}}>{"Please login first!"}</Text></View>)
        }

        const fromList = (
            cardList &&  
                cardList.filter((name) => {
                    return (name.card_id != accountTo)
                 }).map((name) => {
                        return (<Picker.Item label={name.card_id} value={name.card_id} key={name.card_id} />);
                })               
        );

        const toList = (
            cardList &&  
            cardList.filter((name) => {
                return (name.card_id != accountFrom)
             }).map((name) => {
                    return (<Picker.Item label={name.card_id} value={name.card_id} key={name.card_id} />);
            })
        );

        var balance = this.showBalance(accountFrom);
 
        return(
         <View style={styles.container}>
            <View style={styles.from}>
                <Text style={{color:'orange'}}>Transfer From</Text>
                 <Picker
                    style={styles.picker} 
                    itemStyle={styles.picker}
                    selectedValue={accountFrom}
                    mode={'dropdown'}  //'dialog'弹窗 'dropdown'下拉
                    onValueChange={this.onAccountFromChange}>
                    <Picker.Item label={'Please Select'} value={'Please Select'} key={'Please Select'}/>
                    {
                        Platform.OS === 'ios' ? fromList : cardList.map((name) => {
                            return (<Picker.Item label={name.card_id} value={name.card_id} key={name.card_id} />);
                        })
                    }
                </Picker>
                <TextInput style={styles.input} value={balance}/>
            </View>
            <View style={styles.to}>
                <Text style={{color:'green'}}>Transfer To</Text>
                <Picker
                    style={styles.picker} 
                    itemStyle={styles.picker}
                    selectedValue={accountTo}
                    mode={'dropdown'}  //'dialog'弹窗 'dropdown'下拉
                    onValueChange={this.onAccountToChange}>
                    <Picker.Item label={'Please Select'} value={'Please Select'} key={'Please Select'}/>
                    {
                        Platform.OS === 'ios' ? toList : cardList.map((name) => {
                            return (<Picker.Item label={name.card_id} value={name.card_id} key={name.card_id} />);
                        })
                    }
                </Picker>
                <TextInput
                    style={styles.input}
                    onChangeText={this.onTextChange}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.row}>
                <View style={styles.textButton}>
                    <Text style={{color:'white'}} onPress={this.onPress}>Transfer</Text>
                </View>
            </View>
            <View><Text style={{color:'red'}}>{this.state.message}</Text></View>
         </View>
        );
    };

    checkNumber(value) {
        var re = /^[0-9]+.?[0-9]*$/; 
        if (!re.test(value)) {
        　　return false;
        }
        return true;
    }

    judgeAndtransfer(cardList,accountFrom,accountTo,amount){
        if(accountFrom == "Please Select"){
            this.setState({"message":"Please select an outgoing account！"});
        }else if(accountTo == "Please Select"){
            this.setState({"message":"Please select an ingoing account！"});
        }else if(Platform.OS === "android" && accountFrom == accountTo){
            this.setState({"message":"The incoming/outgoing account should be different! "});
        }else if(!this.checkNumber(amount)){
            this.setState({"message":"Transfer amount should be Float type！"});
        }else{
            var balance = parseFloat(this.showBalance(this.state.accountFrom).replace("$","").replace(/,/g,""));
            var amountValue = parseFloat(amount);
            if(amountValue > balance || amountValue <= 0){
                this.setState({"message":"Transfer amount invalid"});
            }else{
                this.setState({"message":""});
                this.props.doTransfer(cardList,accountFrom,accountTo,amount);
                this.props.navigation.navigate('TransferResult',{"fromAccount":accountFrom,"toAccount":accountTo,"amount":amount});
            }
        }
        
    }

    showBalance(account){
        var balance = '';
        for(var i=0; i<this.props.cardList.length; i++)
        {
            if(account == this.props.cardList[i].card_id){
                balance = this.props.cardList[i].balance;
                break;
            }
        }
        return balance;

    };
}

export default connect(
    (states) => ({
        isLoggedIn: states.loginIn.isLoggedIn,
        status: states.transfer.status,
        loaded: states.transfer.loaded,
        cardList: states.transfer.cardList,
        message: states.transfer.message,
    }),
    (dispatch) => ({
        loadData: () => dispatch(transferAction.initAction()),
        doTransfer: (cardList,accountFrom,accountTo,amount) => dispatch(transferAction.doTransfer(cardList,accountFrom,accountTo,amount)),
    })
)(Transfer)

const styles = StyleSheet.create({
    tabBarIcon: {
        width: 21,
        height: 21,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        justifyContent: 'center',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
    from: {
        flexDirection: 'column',
        alignContent: 'flex-start',
        borderColor: 'orange',
        borderWidth: 2,
        margin: 5,
        borderRadius: 5,
    },
    to: {
        flexDirection: 'column',
        alignContent: 'flex-start',
        borderColor: 'green',
        borderWidth: 2,
        margin: 5,
        borderRadius: 5,
    },
    input: {
        height: 40, 
        margin: 5,
        borderColor: 'cornflowerblue', 
        borderWidth: 1,
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
    dropdown_from: {
        alignSelf: 'flex-start',
        width: DWindow.width - 25,
        marginTop: 20,
        margin: 5,
        borderWidth: 0,
        borderRadius: 5,
        backgroundColor: 'orange',
    },
    dropdown_text: {
        marginVertical: 10,
        marginHorizontal: 6,
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    dropdown_from_dropdown: {
        width: DWindow.width - 25,
        height: 300,
        borderColor: 'orange',
        borderWidth: 2,
        borderRadius: 5,
    },
    dropdown_to: {
        alignSelf: 'flex-start',
        width: DWindow.width - 25,
        marginTop: 20,
        margin: 5,
        borderWidth: 0,
        borderRadius: 5,
        backgroundColor: 'green',
    },
    dropdown_to_dropdown: {
        width: DWindow.width - 25,
        height: 200,
        borderColor: 'green',
        borderWidth: 2,
        borderRadius: 5,
    },
    picker: {
        width:DWindow.width - 10,
        height: 100,
    },
});