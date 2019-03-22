import React, { component } from 'react';
import{
    View,
    ProgressBarAndroid,
    Modal,
    StyleSheet,
} from 'react-native';

export default class Loading extends component {
    constructor(props){
        super(props);
        this.status = {};
    }

    render(){
        return (
            <Modal
                transparent = {true}
                onRequestClose={() => this.onRequestClose()}
            >
                <View style={styles.loadingBox}>
                    <ProgressBarAndroid styleAttr='Inverse' color='#FF4500'/>
                </View>
            </Modal>
        );
    }

    onRequestClose(){
        
    }
}

const styles = StyleSheet.create({
    loadingBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(0,0,0,0.5)',
    },
    
});