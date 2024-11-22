// GeoWrapper.js
import * as Geo from '@mapbox/search-js-react';

export default function GeoWrapper(props) {
    const { Geocoder } = Geo;
    return <Geocoder {...props} />;
}
