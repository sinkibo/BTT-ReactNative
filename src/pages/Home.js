import React,{Component} from 'react';
import {Dimensions,StyleSheet,Image,View} from 'react-native'
import Carousel from 'react-native-looped-carousel';

const { width, height } = Dimensions.get('window')
export default class Home extends Component{
    static navigationOptions = {
        tabBarLabel: 'Home',
        tabBarIcon: ({focused}) => {
            if (focused) {
                return (
                    <Image style={styles.tabBarIcon} source={require('../img/home_a.png')}/>
                );
            }
            return (
                <Image style={styles.tabBarIcon} source={require('../img/home.png')}/>
            );
        },
    };

    constructor(props) {
        super(props);
    
        this.state = {
          size: { width, height },
        };
      }

      _onLayoutDidChange = (e) => {
        const layout = e.nativeEvent.layout;
        this.setState({ size: { width: layout.width, height: layout.height } });
      }

    render(){
        return (
            <View style={{ flex: 1 }} onLayout={this._onLayoutDidChange}>
                <Carousel
                delay={2000}
                style={this.state.size}
                autoplay
                //pageInfo
                //onAnimateNextPage={(p) => console.log(p)}
                swiper      //允许手势滑动
                bullets={true}  //显示小圆点
                bulletStyle={{
                    width: 12,
                    height: 12,
                    borderRadius: 50,
                    borderColor:'rgba(255,255,255,0.4)',
                    margin:6
                }} 
                chosenBulletStyle={{
                    width: 16,
                    height: 16,
                    borderRadius: 50,
                    margin:6
                }}
                >
                <View style={[ this.state.size]}><Image source={require('../img/BTT.jpg')} style={styles.img}/></View>
                <View style={[this.state.size]}><Image source={require('../img/ClientEngine.jpg')} style={styles.img}/></View>
                <View style={[ this.state.size]}><Image source={require('../img/sample.jpg')} style={styles.img}/></View>
                </Carousel>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: 400,
        padding: 20,
        
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    copy: {
        color: 'blue',
        textAlign: 'right',
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    swiper: { 
        alignItems:'center',
    },
    img: {
        //flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: 200,

    },
    tabBarIcon: {
        width: 21,
        height: 21,
    }
});