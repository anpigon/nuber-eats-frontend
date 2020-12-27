import React, { useEffect } from "react";
import GoogleMapReact from "google-map-react";

export const Dashboard = () => {
  const onWatchSuccess = (coords: GeolocationPosition) => {
    console.log(coords);
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onWatchSuccess);
  }, []);

  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "95vh" }}
      >
        <GoogleMapReact
          defaultZoom={10}
          draggable={false}
          defaultCenter={{
            lat: 37.715133,
            lng: 126.734086,
          }}
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API_KEY! }}
        ></GoogleMapReact>
      </div>
    </div>
  );
};