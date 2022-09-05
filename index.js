import axios from "axios";
import Geolocation from 'react-native-geolocation-service';
 import {PermissionsAndroid} from 'react-native';

export default class updateLocation {
  static starttracking = false;
  static stoptracking = false;
  static updateAfterInSeconds = 5;
  static contactInfo = '';
  static APIKey = '';

      static UserInfo = {lat:39.765,lng: -121.960,contactNo:"+18622878740"};

     static headersList = {
        Accept: "/",
        Authorization: this.APIKey,
        "Content-Type": "application/json"
       }
       
       static bodyContent = {
           deliverypersonphonenumber:this.UserInfo.contactNo,
           currentlatlng: {
               lat: this.UserInfo.lat,
               lng: this.UserInfo.lng
           }
       };
       
       static reqOptions = {
         url: "https://api.onroad.app/updatelocation",
         method: "POST",
         headers: this.headersList,
         data: this.bodyContent,
       }
    
    static MyNewLocationIs(params) {
        this.info = params;
        this.bodyContent.currentlatlng.lat = params.coords['latitude'];
        this.bodyContent.currentlatlng.lng = params.coords['longitude'];
        this.reqOptions.data = this.bodyContent;

            (async () => {
                try {
                  console.log('final before');
                  console.log(this.bodyContent.deliverypersonphonenumber);
                  const result = await axios.request(this.reqOptions);
                  console.log(result.data);
                  console.log('final result');
                } catch(e) {

                    console.log('Error in updation');
                }
              })()

       
    }

    static findCoordinates = () => {
      if( this.starttracking ==false)
        return;

      //if (hasLocationPermission) {
       (async () => {
         const granted = await PermissionsAndroid.request(
           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
           {
             'title': 'Example App',
             'message': 'Example App access to your location '
           }
         )
         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
           // console.log("You can use the location")
           // alert("You can use the location");
           Geolocation.getCurrentPosition(
             (position) => {
               const location = position;
               this.MyNewLocationIs(location);
              
                
             },
             (error) => {
               // See error code charts below.
               console.log(error.code, error.message);
             },
             { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
         );
         } else {
           console.log("location permission denied")
           alert("Location permission denied");
         }
         
     })();
      
     //}
   }
   
   
   static start = () => {
    console.log('start called!'+ this.APIKey);
    if(this.updateAfterInSeconds<=3)
      this.updateAfterInSeconds = 3;

    this.starttracking = true;
    this.headersList.Authorization = this.APIKey;
    this.bodyContent.deliverypersonphonenumber = this.contactInfo;
    interval = setInterval(() => this.findCoordinates(), (this.updateAfterInSeconds * 1000));
    console.log('start called end.');
   }

   static stop = () => {
    console.log('stop called!');
    this.starttracking = false;
    clearInterval(interval);
    console.log('stop called end.');
   }
}