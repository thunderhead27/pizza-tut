import React from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'

const containerStyle = {
    width: '100%',
    height: '100%'
};

function Map({ center }: any) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        //@ts-ignore
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API // ,
    })

    const onLoad = marker => {
        console.log('marker: ', marker)
    }

    const renderMap = () => {
        return <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={containerStyle}
        >
            <Marker
                onLoad={onLoad}
                position={center}
            />
        </GoogleMap>
    }

    return isLoaded ? renderMap() : <></>;
}

export default React.memo(Map)