import React, { useEffect, useState } from 'react';
import { Text, View, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import ChatFaceData from '../Services/ChatFaceData';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const [chatFaceData, setChatFaceData] = useState([]);
    const [selectedChatFaceData, setSelectedChatFaceData] = useState([]);
    const navigation = useNavigation();
    
    useEffect(() => {
        setChatFaceData(ChatFaceData);
        setSelectedChatFaceData(ChatFaceData[0]);
        console.log(ChatFaceData[0]);
    },[])

    const onChatFacePress = (id) => {
        setSelectedChatFaceData(ChatFaceData[id-1]);
    }

  return (
    <View style={{alignItems:'center', paddingTop:90}}>
      <Text style={[{color:selectedChatFaceData.primary}, {fontSize:30}]}>Hello</Text>
      <Text style={[{color:selectedChatFaceData.primary}, {fontSize:30, fontWeight:'bold'}]}>I am {selectedChatFaceData.name}</Text>
      <Image source={{uri:selectedChatFaceData.image}} style={{width:150, height:150, marginTop:20}}/>
      <Text style={{marginTop:30, fontSize:25}}>How can I help you?</Text>

      <View style={{marginTop:20, backgroundColor:"#F5F5F5", alignItems:'center', height:110, padding:10, borderRadius:10}}>
        <FlatList
            data={chatFaceData}
            horizontal={true}
            renderItem={({item}) => selectedChatFaceData.id != item.id && (
                <TouchableOpacity style={{margin:15}} onPress={() => onChatFacePress(item.id)}>
                    <Image source={{uri:item.image}} style={{width:40, height:40}} />
                </TouchableOpacity>
            )}
        />
        <Text style={{marginTop:5, fontSize:17, color:"#B0B0B0"}}>Choose Your Favourite ChatBuddy</Text>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('chat')} style={[{backgroundColor:selectedChatFaceData.primary}, {padding:17, width:Dimensions.get('screen').width*0.6, borderRadius:100, alignItems:'center', marginTop:30}]}>
        <Text style={{fontSize:16, color:'#fff'}}>Get Started</Text>
      </TouchableOpacity>
    </View>
  )
}