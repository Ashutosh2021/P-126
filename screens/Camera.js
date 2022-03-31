import * as React from 'react'
import {View,Button,Platform} from 'react-native'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'

export default class PickImage extends React.Component{
state={
    "image" : null
  }

  componentDidMount(){
    this.getPermissionAsync()
  }

getPermissionAsync=async()=>{
    if(Platform.OS != "web"){
        const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        
        if(status !== "granted"){
            alert("Sorry we need camera permission to work")
        }
    }
}

pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ image: result.data });
        //console.log(result)
        this.uploadImage(result.uri);
      }
    } catch (E) {
      console.log(E);
    }
}

uploadImage = async (uri) => {
    const data = new FormData();
    let filename = uri.split("/")[uri.split("/").length - 1]
    let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
    const fileToUpload = {
      uri: uri,
      name: filename,
      type: type,
    };
    //console.log(data)
    data.append("digit", fileToUpload);
    //console.log(data)

    fetch("https://c95d-2409-4063-6c8d-94f4-9b-46ae-a1d6-cd38.ngrok.io/predict-alphabet", {
      method: "POST",
      body: data,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  
  render(){
  
    return(
    
    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
       <Button title={"Pick an Image from the camera roll"} onPress={this.pickImage}/>
    </View>
    )
    }

}