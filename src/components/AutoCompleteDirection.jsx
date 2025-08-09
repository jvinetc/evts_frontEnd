import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AutoCompleteDirection = ({ onSelect, modoEdicion, addres, showModal }) => {
    const [inputText, setInputText] = useState(!addres ? '' : addres);
    const [suggestions, setSuggestions] = useState([]);
    const [blockAutocomplete, setBlockAutocomplete] = useState(false);
    const url = import.meta.env.VITE_SERVER;

    /* useEffect(() => {
        if (!window.google || !window.google.maps) return;

        const autocompleteService = new window.google.maps.places.AutocompleteService();
        const boundsRM = new window.google.maps.LatLngBounds(
            new window.google.maps.LatLng(-33.7, -71.0), // suroeste
            new window.google.maps.LatLng(-33.3, -70.4)  // noreste
        );

        if (inputText.length > 3 && modoEdicion) {
            autocompleteService.getPlacePredictions({
                input: inputText,
                bounds: boundsRM,
                componentRestrictions: { country: 'cl' }
            },
                (predictions, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        setSuggestions(predictions);
                    } else {
                        setSuggestions([]);
                    }
                });
        } else {
            setSuggestions([]);
        }
    }, [inputText]); */
    useEffect(() => {
        const autocomplete = async () => {
            if(blockAutocomplete){
                setBlockAutocomplete(false);
                return;
            }
            try {
                if (inputText.length > 3 && modoEdicion) {
                    const { data } = await axios.post(`${url}/autocomplete/${inputText}`);
                    const suggestions = data.data.suggestions;
                    if (!suggestions) {
                        setSuggestions([]);
                    } else {
                        setSuggestions(suggestions);
                    }

                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.log(error)
            }
        }
        autocomplete();
    }, [inputText])

    const handleSelect = async (placeId) => {
        try {
            const { data } = await axios.get(`${url}/autocomplete/detail/${placeId}`);
            const { addres, streetName, streetNumber, comuna, lat, lng } = data.data;
            if (!addres || !streetName || !streetNumber || !comuna || !lat || !lng) {
                setSuggestions([]);
                showModal('La direccion ingresada no es valida');
                return;
            }
            setBlockAutocomplete(true);
            setInputText(addres);
            onSelect({ addres:`${streetName} ${streetNumber}`, comuna, lat, lng })
            setSuggestions([]);
        } catch (error) {
            console.log(error)
        }

    };

    return (
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <input
                type="text"
                value={inputText}
                readOnly={!modoEdicion}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Buscar dirección..."
                style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            />

            {suggestions.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '8px', border: '1px solid #ccc' }}>
                    {suggestions.map((s) => (
                        <li
                            key={s.placePrediction.placeId}
                            onClick={() => handleSelect(s.placePrediction.placeId)}
                            style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                        >
                            {s.placePrediction.text.text}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AutoCompleteDirection

/* const dummyMap = document.createElement('div');
       const placesService = new window.google.maps.places.PlacesService(dummyMap);

       placesService.getDetails(
           {
               placeId
           },
           (place, status) => {
               if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                   const vicinity = place.vicinity.split(', ');
                   const [direccion, comuna] = vicinity.filter(vicy => (vicy !== 'Santiago'))
                   setSuggestions([]);
                   onSelect({ direccion, comuna, lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
                   setInputText(place.formatted_address);

               }
           }
       ); */