import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom DivIcon for Duration/Distance Labels
const createLabelIcon = (text, type = 'primary') => {
    // Primary = Blue, Secondary = Red
    const bgColor = type === 'primary' ? '#007bff' : '#FF3131';

    return L.divIcon({
        className: 'custom-map-label',
        html: `<div style="
            background-color: ${bgColor};
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            white-space: nowrap;
            display: flex;
            flex-direction: column;
            align-items: center;
        ">
            ${text}
            <div style="
                width: 0; 
                height: 0; 
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 5px solid ${bgColor};
                position: absolute;
                bottom: -5px;
            "></div>
        </div>`,
        iconSize: [100, 40],
        iconAnchor: [50, 45]
    });
};

// Component to handle map clicks
function MapEvents({ onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
}

// Component to update map view
function MapUpdater({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
}

export default function MapVisualizer() {
    const [source, setSource] = useState(null);
    const [destination, setDestination] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPlaceName = async (lat, lng) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            if (data && data.display_name) {
                // Extract a shorter name (e.g., first 3 parts)
                return data.display_name.split(',').slice(0, 3).join(',');
            }
            return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        } catch (error) {
            console.error("Geocoding error:", error);
            return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
    };

    const handleMapClick = async (latlng) => {
        const name = await fetchPlaceName(latlng.lat, latlng.lng);

        if (!source) {
            setSource({ ...latlng, name });
        } else if (!destination) {
            setDestination({ ...latlng, name });
        } else {
            // Reset if both set
            // Optional: allow resetting by clicking somewhere new? 
            // For now, let's keep it simple: Reset button checks this.
        }
    };

    const resetMap = () => {
        setSource(null);
        setDestination(null);
        setRoutes([]);
    };

    const fetchRoutes = async () => {
        if (!source || !destination) return;
        setLoading(true);

        try {
            // Call OSRM with alternatives=true
            const url = `https://router.project-osrm.org/route/v1/driving/${source.lng},${source.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&alternatives=true`;
            console.log("Fetching routes:", url);

            const response = await fetch(url);
            const data = await response.json();

            if (data.code === 'Ok' && data.routes) {
                // Process routes
                const processedRoutes = data.routes.map((route, index) => {
                    return {
                        id: index,
                        // Decode GeoJSON [lng, lat] to Leaflet [lat, lng]
                        coordinates: route.geometry.coordinates.map(c => [c[1], c[0]]),
                        distance: (route.distance / 1000).toFixed(1), // km
                        duration: (route.duration / 60).toFixed(0), // min
                        isPrimary: index === 0, // Assume first is best/shortest
                        summary: route.legs && route.legs[0] ? route.legs[0].summary : ''
                    };
                });

                // Sort so primary is last (rendered on top) - actually Leaflet renders in order, so we want primary last in array
                // But generally 0 is primary. Let's just store them.
                setRoutes(processedRoutes);
            } else {
                console.warn("No routes found", data);
                alert("No route found between these points.");
            }

        } catch (error) {
            console.error("Error fetching routes:", error);
            alert("Error fetching routes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (source && destination) {
            fetchRoutes();
        }
    }, [source, destination]);

    // Helper to get midpoint index for label
    const getMidpoint = (coords) => {
        if (!coords || coords.length === 0) return null;
        return coords[Math.floor(coords.length / 2)];
    };


    return (
        <div className="h-[calc(100vh-64px)] w-full relative">
            {/* Map Container */}
            <MapContainer
                center={[20.5937, 78.9629]} // Center of India
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                {/* Satellite Tile Layer */}
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='Tiles &copy; Esri &mdash; Source: Esri'
                />

                {/* Labels overlay (optional, improves context on satellite) */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                <MapEvents onMapClick={handleMapClick} />

                {/* Source Marker */}
                {source && (
                    <Marker position={source}>
                        <Popup>
                            <strong>Source:</strong> <br />
                            {source.name}
                        </Popup>
                    </Marker>
                )}

                {/* Destination Marker */}
                {destination && (
                    <Marker position={destination}>
                        <Popup>
                            <strong>Destination:</strong> <br />
                            {destination.name}
                        </Popup>
                    </Marker>
                )}

                {/* Routes */}
                {routes.map((route) => (
                    <Polyline
                        key={route.id}
                        positions={route.coordinates}
                        pathOptions={{
                            color: route.isPrimary ? '#007bff' : '#FF3131', // Blue for primary, Red for alt
                            weight: 6,
                            opacity: 0.9,
                            className: route.isPrimary ? 'neon-blue-path' : 'neon-red-path' // Neon for both
                        }}
                        eventHandlers={{
                            click: () => {
                                // Simple way to make a route primary on click:
                                const newRoutes = routes.map(r => ({
                                    ...r,
                                    isPrimary: r.id === route.id
                                }));
                                setRoutes(newRoutes);
                            }
                        }}
                    />
                ))}

                {/* Route Labels (Duration/Distance) */}
                {routes.map((route) => {
                    const mid = getMidpoint(route.coordinates);
                    if (!mid) return null;
                    return (
                        <Marker
                            key={`label-${route.id}`}
                            position={mid}
                            icon={createLabelIcon(
                                `${route.duration} min <br/> ${route.distance} km`,
                                route.isPrimary ? 'primary' : 'secondary'
                            )}
                            zIndexOffset={route.isPrimary ? 1000 : 0}
                        />
                    );
                })}

            </MapContainer>

            {/* Controls Panel */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-2xl z-[1000] w-80 border border-white/20">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Route Finder
                </h2>

                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Click anywhere on the map to set Source and Destination.
                    </p>

                    <div className="flex flex-col gap-2">
                        <div className={`p-3 rounded-lg border ${source ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                            <span className="text-xs font-semibold text-gray-500 uppercase">Source</span>
                            <div className="font-medium text-sm text-gray-800 break-words">
                                {source ? source.name : 'Select on map'}
                            </div>
                        </div>
                        <div className={`p-3 rounded-lg border ${destination ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                            <span className="text-xs font-semibold text-gray-500 uppercase">Destination</span>
                            <div className="font-medium text-sm text-gray-800 break-words">
                                {destination ? destination.name : 'Select on map'}
                            </div>
                        </div>
                    </div>

                    {loading && (
                        <div className="text-center text-blue-600 font-semibold animate-pulse">
                            Finding Best Routes...
                        </div>
                    )}

                    {routes.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-bold text-gray-700">Routes:</h3>
                            {routes.map(route => (
                                <div
                                    key={route.id}
                                    className={`p-2 rounded cursor-pointer border ${route.isPrimary ? 'bg-blue-50 border-blue-400' : 'bg-red-50 border-red-400 hover:bg-red-100'}`}
                                    onClick={() => {
                                        const newRoutes = routes.map(r => ({
                                            ...r,
                                            isPrimary: r.id === route.id
                                        }));
                                        setRoutes(newRoutes);
                                    }}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className={`font-bold ${route.isPrimary ? 'text-blue-800' : 'text-gray-700'}`}>
                                            {route.duration} min
                                        </span>
                                        <span className="text-sm text-gray-600">{route.distance} km</span>
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">
                                        via {route.summary || 'Road'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={resetMap}
                        className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors mt-2"
                    >
                        Reset / New Route
                    </button>
                </div>
            </div>
        </div>
    );
}
