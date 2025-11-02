import React, { useState, useEffect } from 'react';
import type { DistrictData } from '@/types';

interface DistrictSelectorProps {
  onSelect: (district: DistrictData) => void;
  selectedDistrict?: DistrictData;
}

// List of states with available district data
const STATES = [
  { code: 'BR', name: 'Bihar', nameHindi: 'बिहार' },
  { code: 'MH', name: 'Maharashtra', nameHindi: 'महाराष्ट्र' },
  { code: 'RJ', name: 'Rajasthan', nameHindi: 'राजस्थान' },
  { code: 'UP', name: 'Uttar Pradesh', nameHindi: 'उत्तर प्रदेश' },
  { code: 'WB', name: 'West Bengal', nameHindi: 'पश्चिम बंगाल' },
];

export default function DistrictSelector({ onSelect, selectedDistrict }: DistrictSelectorProps) {
  const [allDistricts, setAllDistricts] = useState<DistrictData[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<DistrictData[]>([]);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAllDistricts();
  }, []);

  const fetchAllDistricts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/districts');
      const data = await res.json();
      if (data.success) {
        setAllDistricts(data.data);
        setFilteredDistricts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch districts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter districts by state and search
  useEffect(() => {
    let filtered = [...allDistricts];

    // Filter by state
    if (selectedState) {
      filtered = filtered.filter(d => d.stateCode === selectedState);
    }

    // Filter by search
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(searchLower) ||
        (d.nameHindi && d.nameHindi.includes(search.trim())) ||
        d.code.toLowerCase().includes(searchLower)
      );
    }

    setFilteredDistricts(filtered);
  }, [selectedState, search, allDistricts]);

  const detectLocation = async () => {
    if (!('geolocation' in navigator)) {
      alert('आपका ब्राउज़र स्थान सेवा का समर्थन नहीं करता\nYour browser does not support geolocation');
      return;
    }

    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords;
          
          console.log('Location detected:', { latitude, longitude, accuracy });
          
          const res = await fetch('/api/detect-district', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude }),
          });

          const data = await res.json();
          
          if (data.success && data.data) {
            const { district, distance } = data.data;
            
            // Set the state based on detected district
            setSelectedState(district.stateCode);
            
            // Select the district
            onSelect(district);
            
            // If district is nearby (within 50km), assume it's the user's district - auto-select silently
            // If far away (>50km), show alert that current location is not in database
            if (distance > 50) {
              const message = 
                `आपका वर्तमान स्थान MGNREGA डेटाबेस में उपलब्ध नहीं है\n` +
                `Your current location is not in MGNREGA database\n\n` +
                `हम केवल इन राज्यों का डेटा दिखा सकते हैं:\n` +
                `We can only show data for these states:\n` +
                `Bihar, Maharashtra, Rajasthan, Uttar Pradesh, West Bengal\n\n` +
                `निकटतम उपलब्ध MGNREGA जिला:\n` +
                `Showing nearest available MGNREGA district:\n` +
                `District: ${district.name}\n` +
                `State: ${district.stateName}\n` +
                `Distance: ${distance.toFixed(1)} km`;
              
              alert(message);
            }
            // If within 50km, silently auto-select (user's actual location)
          } else {
            alert('जिला खोजने में असमर्थ\nUnable to find district');
          }
        } catch (error) {
          console.error('Failed to detect district:', error);
          alert('स्थान का पता लगाने में त्रुटि\nError detecting location');
        } finally {
          setDetecting(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let message = 'स्थान एक्सेस में त्रुटि\nLocation access error\n\n';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            message += 'कृपया स्थान की अनुमति दें\nPlease allow location access';
            break;
          case error.POSITION_UNAVAILABLE:
            message += 'स्थान उपलब्ध नहीं है\nLocation unavailable';
            break;
          case error.TIMEOUT:
            message += 'अनुरोध समय समाप्त\nRequest timed out';
            break;
        }
        
        alert(message);
        setDetecting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">
        <span className="block text-3xl mb-2">अपना जिला चुनें</span>
        Select Your District
      </h2>

      {/* Auto-detect location button */}
      <button
        onClick={detectLocation}
        disabled={detecting}
        className="btn-primary w-full mb-6 flex items-center justify-center gap-3"
      >
        <span className="text-3xl">📍</span>
        <span>
          {detecting ? (
            <>
              <span className="block">पता लगाया जा रहा है...</span>
              <span className="text-sm">Detecting...</span>
            </>
          ) : (
            <>
              <span className="block">मेरा स्थान खोजें</span>
              <span className="text-sm">Auto-detect My Location</span>
            </>
          )}
        </span>
      </button>

      <div className="relative mb-4">
        <div className="text-center text-gray-500 mb-4">
          <span className="bg-gray-50 px-3 py-1 rounded">या / OR</span>
        </div>
      </div>

      {/* State selection */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">
          <span className="block text-xl">पहले राज्य चुनें</span>
          <span className="text-sm text-gray-600">First Select State</span>
        </label>
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSearch('');
          }}
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
        >
          <option value="">-- सभी राज्य / All States --</option>
          {STATES.map((state) => (
            <option key={state.code} value={state.code}>
              {state.nameHindi} / {state.name}
            </option>
          ))}
        </select>
      </div>

      {/* Search input */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">
          <span className="block text-xl">जिले का नाम खोजें</span>
          <span className="text-sm text-gray-600">Search District Name</span>
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type district name... / जिले का नाम लिखें..."
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
        />
        {search && (
          <p className="text-sm mt-2 text-gray-600">
            🔍 {filteredDistricts.length} जिले मिले / districts found
            {selectedState && ` in ${STATES.find(s => s.code === selectedState)?.name}`}
          </p>
        )}
      </div>

      {/* Show filtered districts as list when searching */}
      {search && filteredDistricts.length > 0 && (
        <div className="mb-4 max-h-64 overflow-y-auto border-2 border-gray-200 rounded-lg">
          <div className="bg-gray-50 px-4 py-2 font-medium sticky top-0">
            खोज परिणाम / Search Results ({filteredDistricts.length})
          </div>
          {filteredDistricts.map((district: DistrictData) => (
            <button
              key={district.id}
              onClick={() => {
                onSelect(district);
                setSearch('');
              }}
              className="w-full text-left px-4 py-3 hover:bg-primary-50 border-b border-gray-100 transition-colors"
            >
              <div className="font-medium text-lg">
                {district.nameHindi} / {district.name}
              </div>
              <div className="text-sm text-gray-600">
                {district.stateName || district.stateCode} • {district.code}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* District dropdown */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">
          <span className="block text-xl">जिला चुनें</span>
          <span className="text-sm text-gray-600">
            Select District 
            {selectedState && ` (${filteredDistricts.length} in ${STATES.find(s => s.code === selectedState)?.name})`}
            {!selectedState && ` (${filteredDistricts.length} total)`}
          </span>
        </label>
        <select
          value={selectedDistrict?.id || ''}
          onChange={(e) => {
            const district = filteredDistricts.find((d: DistrictData) => d.id === e.target.value);
            if (district) onSelect(district);
          }}
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
          disabled={loading}
        >
          <option value="">-- चुनें / Select --</option>
          {filteredDistricts.map((district: DistrictData) => (
            <option key={district.id} value={district.id}>
              {district.nameHindi} / {district.name}
            </option>
          ))}
        </select>
        {filteredDistricts.length === 0 && !loading && (
          <p className="text-sm text-red-600 mt-2">
            ⚠️ कोई जिला नहीं मिला / No districts found
            {selectedState && ' in selected state'}
          </p>
        )}
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">लोड हो रहा है... / Loading...</p>
        </div>
      )}

      {selectedDistrict && (
        <div className="mt-6 p-4 bg-green-50 border-2 border-green-500 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✓</span>
            <div>
              <div className="text-lg font-bold text-green-900">
                {selectedDistrict.nameHindi || selectedDistrict.name}
              </div>
              <div className="text-sm text-green-700">
                {selectedDistrict.name} - {selectedDistrict.stateCode}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
