import React from 'react';
import L from 'leaflet';
import {MapContainer, TileLayer, Popup, Marker, LayersControl, LayerGroup, ScaleControl} from "react-leaflet";
import './Map.css';
import {MainNavBar} from "../MainNavBar/MainNavBar"
import {Header} from "../Header/Header";
import {MainMenu} from "../Header/MainMenu/MainMenu";
// L.Icon.Default.imagePath = "D:/react projects/react-leaflet-app/src/components/icons/small-marker.jpg";
function GetIcon(_iconSize){
    return L.icon({
        iconUrl: require("../../icons/marker.png"),
        iconSize: [_iconSize]
    })
}
export default function MapComponent(){
        const {BaseLayer} = LayersControl;
        let center = [35.702, 37.530]
    return (
            <div>
                <MapContainer minZoom={3} maxZoom={12} zoom={3} center={center}>
                    <ScaleControl position="topleft" />
                    <Header />
                    <MainNavBar />
                    <LayersControl>
                        <BaseLayer name="Sattelite">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url={'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/{z}/{x}/{y}?access_token=sk.eyJ1IjoicnViaW5uYXciLCJhIjoiY2xiMTFmcnZmMXBnbDNwbXA4bHFkcDdyciJ9.CxX9zdanJzvnGxgEDz7bJw'}

                            />
                        </BaseLayer>
                        <BaseLayer name="Streets">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
                            />
                        </BaseLayer>
                        <BaseLayer name="NavBar">
                            <LayerGroup>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
                                />
                                <Marker position={[55,33]} icon={GetIcon(20,20)}>
                                    <Popup>
                                        yoooo
                                    </Popup>
                                </Marker>
                            </LayerGroup>
                        </BaseLayer>
                    </LayersControl>
                    <Marker position={center} icon={GetIcon(20,20)}>
                        <Popup>
                            text here
                        </Popup>
                    </Marker>
                </MapContainer>

            </div>
        );
    }