import { useState, useEffect } from 'react';
import { APIProvider, Map, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Box, Typography, Alert } from '@mui/material';
import { LocationOn, CalendarToday, Euro } from '@mui/icons-material';
import './EventMap.css';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

function ClusteredMarkers({ events, onMarkerClick }) {
    const map = useMap();
    const [cluster, setCluster] = useState(null);
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        if (!map || !window.google || !events?.length) return;

        markers.forEach(m => m.setMap(null));
        cluster?.clearMarkers();

        const validEvents = events.filter(
            e => e.location?.coordinates?.lat && e.location?.coordinates?.lng
        );

        const newMarkers = validEvents.map(event => {
            const marker = new window.google.maps.Marker({
                position: {
                    lat: event.location.coordinates.lat,
                    lng: event.location.coordinates.lng
                },
                map,
                title: event.titolo || event.title
            });

            marker.addListener('click', () => onMarkerClick(event));
            return marker;
        });

        setMarkers(newMarkers);
        const newCluster = new MarkerClusterer({ markers: newMarkers, map });
        setCluster(newCluster);

        return () => {
            newCluster?.clearMarkers();
            newMarkers.forEach(m => m.setMap(null));
        };
    }, [map, events, onMarkerClick]);

    return null;
}

function MapController({ center }) {
    const map = useMap();

    useEffect(() => {
        if (map && center) {
            map.panTo(center);
            map.setZoom(15);
        }
    }, [map, center]);

    return null;
}

export default function EventMap({ events, center }) {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const defaultCenter = { lat: 41.1171, lng: 16.8719 };

    

    if (!API_KEY) {
        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Alert severity="error">
                    Google Maps API Key non configurata. Aggiungi <b>REACT_APP_GOOGLE_MAPS_API_KEY</b> al file <code>.env</code>
                </Alert>
            </div>
        );
    }

    if (!events || events.length === 0) {
        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Alert severity="info">Nessun evento da visualizzare sulla mappa</Alert>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}>
            <APIProvider apiKey={API_KEY} language="it">
                <Map
                    style={{ width: '100%', height: '100%' }}
                    defaultCenter={defaultCenter}
                    defaultZoom={8}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    mapId="eventi-puglia-map"
                    onClick={() => setSelectedEvent(null)}
                >
                    <MapController center={center} />
                    <ClusteredMarkers events={events} onMarkerClick={setSelectedEvent} />

                    {selectedEvent?.location?.coordinates && (
                        <InfoWindow
                            position={{
                                lat: selectedEvent.location.coordinates.lat,
                                lng: selectedEvent.location.coordinates.lng
                            }}
                            onCloseClick={() => setSelectedEvent(null)}
                        >
                            <Box sx={{ maxWidth: 300, p: 1 }}>
                                <Typography variant="h6" gutterBottom sx={{fontFamily:"'Rische', sans-serif"}}>
                                    {selectedEvent.titolo}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <CalendarToday fontSize="small" sx={{ mr: 1, fontSize: 16 }} />
                                    <Typography variant="body2" sx={{fontFamily:"'Rische', sans-serif"}}>
                                        {selectedEvent.dataEvento
                                            ? new Date(selectedEvent.dataEvento).toLocaleDateString('it-IT', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })
                                            : ""}
                                    </Typography>
                                    <Typography variant="body2" sx={{fontFamily:"'Rische', sans-serif",ml:1}}>
                                        {selectedEvent.oraEvento}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <LocationOn fontSize="small" sx={{ mr: 1, fontSize: 16 }} />
                                    <Typography variant="body2" sx={{fontFamily:"'Rische', sans-serif"}}>
                                        {selectedEvent.location?.address || 'Indirizzo non disponibile'}
                                    </Typography>
                                </Box>

                                {selectedEvent.prezzo !== undefined && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Euro fontSize="small" sx={{ mr: 1, fontSize: 16 }} />
                                        <Typography variant="body2" sx={{fontFamily:"'Rische', sans-serif"}}>
                                            {selectedEvent.prezzo === 0 ? 'Gratuito' : `${selectedEvent.prezzo}`}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </InfoWindow>
                    )}
                </Map>
            </APIProvider>
        </div>
    );
}
