import React, { Component } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';


export default class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
        
    render() {
    const { mapRegion, markerCord, mapStyle,nearby, onRegionChange, markerRef } = this.props;
        return (
            <MapView
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                followUserLocation
                loadingEnabled
                showsMyLocationButton={true}
                style={[mapStyle,{ marginBottom: this.state.marginBottom }]}
                region={mapRegion}
                onRegionChange={onRegionChange}
                onMapReady={() => this.setState({ marginBottom: 1 })}
            >
                <Marker.Animated
                    ref={markerRef}
                    coordinate={{latitude: markerCord.droplatitude?markerCord.droplatitude:markerCord.wherelatitude, longitude: markerCord.droplongitude?markerCord.droplongitude:markerCord.wherelongitude}}
                    image={require('../../assets/images/rsz_2red_pin.png')}
                />
             {nearby?nearby.map((item,index)=>{
                return (
                    <Marker.Animated
                    coordinate={{latitude: item.location?item.location.lat:0.00, longitude: item.location?item.location.lng:0.00}}
                    key = {index}
                    image={require('../../assets/images/available_car.png')}
                />
                )
             })
            :null}
             
            </MapView>
        );
    }
}
