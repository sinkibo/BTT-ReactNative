//"react-native-modal-dropdown": "^0.6.2",
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    TextInput,
    View,
    Dimensions,
    Picker,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { connect } from 'react-redux';
import * as transferAction from '../actions/transferAction';

const DWindow = Dimensions.get('window')

export class Transfer extends Component{

    constructor(props) {
        super(props);
        this.state = {
            balance: '',
            accountFrom: 'Please Select',
            accountTo:'Please Select',
            accountToTotal: [],
            amount:0,
        }
    }

    static navigationOptions = {
        tabBarLabel: 'Transfer',
        tabBarIcon: ({focused}) => {
            if (focused) {
                return (
                    <Image style={styles.tabBarIcon} source={require('../img/rabis.jpg')}/>
                );
            }
            return (
                <Image style={styles.tabBarIcon} source={require('../img/cat.jpg')}/>
            );
        },
    };

    componentWillMount(){
        this.props.loadData();
    }

    render(){
        return(
         <View style={styles.container}>
            <View style={styles.from}>
                <Text style={{color:'orange'}}>Transfer From</Text>
                 <Picker
                    style={styles.picker} 
                    itemStyle={styles.picker}
                    selectedValue={this.state.accountFrom}
                    mode={'dropdown'}  //'dialog'弹窗 'dropdown'下拉
                    onValueChange={(value) => {
                        this.showBalance(value)
                    }}>
                    {this.props.account ? (this.props.account.map((name) => <Picker.Item label={name} value={name} key={name} />)) : <Picker.Item label={'Please Select'} value={'Please Select'} key={'Please Select'}/>}
                </Picker>
                <ModalDropdown ref="dropdown"
                    style={styles.dropdown_from}
                    textStyle={styles.dropdown_text}
                    dropdownStyle={styles.dropdown_from_dropdown}
                    options={this.props.account} 
                    animated={false}
                    onSelect={(index,value)=> this.showBalance(value)}
                />
                <TextInput style={styles.input} value={this.state.balance}/>
            </View>
            <View style={styles.to}>
                <Text style={{color:'green'}}>Transfer To</Text>
                <Picker
                    style={styles.picker} 
                    itemStyle={styles.picker}
                    selectedValue={this.state.accountTo}
                    mode={'dropdown'}  //'dialog'弹窗 'dropdown'下拉
                    onValueChange={(value) => {
                        this.setState({"accountTo":value});
                    }}>
                    {this.state.accountToTotal ? (this.state.accountToTotal.map((name) => <Picker.Item label={name} value={name} key={name} />)) : <Picker.Item label={'Please Select'} value={'Please Select'} key={'Please Select'}/>}
                </Picker>
                <ModalDropdown ref="dropdown"
                    style={styles.dropdown_to}
                    textStyle={styles.dropdown_text}
                    dropdownStyle={styles.dropdown_to_dropdown}
                    options={this.props.account} 
                    animated={false} 
                    onSelect={(index,value)=> this.mutex(value)}
                />
                <TextInput
                    style={styles.input}
                    value="$"
                    //onChangeText={(text) => this.setState({text})}
                    //value={this.state.text}
                />
            </View>
            <View style={styles.row}>
                <View style={styles.textButton}>
                    <Text style={{color:'white'}} onPress={this.doTransfer}>Transfer</Text>
                </View>
            </View>
         </View>
        );
    };
    doTransfer(){
        

    };
    showBalance(account){
        this.setState({"accountFrom":account});
        var toAccountList = [];
        for(var i=0; i<this.props.cardList.length; i++)
        {
            if(account == this.props.cardList[i].card_id){
                this.setState({"balance":this.props.cardList[i].balance});
            }else{
                toAccountList.push(this.props.cardList[i].card_id);
            }
        }
        this.setState({"accountToTotal":toAccountList});

    };
    mutex(){

    }
}

export default connect(
    (states) => ({
        status: states.transfer.status,
        loaded: states.transfer.loaded,
        cardList: states.transfer.cardList,
        message: states.transfer.message,
        account: states.transfer.account,
    }),
    (dispatch) => ({
        loadData: () => dispatch(transferAction.initAction()),
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
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
    from: {
        //flex: 1,
        flexDirection: 'column',
        alignContent: 'flex-start',
        borderColor: 'orange',
        borderWidth: 2,
        margin: 5,
        borderRadius: 5,
    },
    to: {
        //flex: 1,
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
        //flex布局
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
        height: 100,
    },
});