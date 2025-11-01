// Test script to check data.gov.in API response structure
require('dotenv').config();

async function testAPI() {
  const apiKey = process.env.MGNREGA_API_KEY;
  const baseUrl = process.env.MGNREGA_API_BASE_URL;
  
  console.log('Testing API with:');
  console.log('Base URL:', baseUrl);
  console.log('API Key:', apiKey ? '***' + apiKey.slice(-8) : 'NOT SET');
  
  // Test with a simple request
  const url = new URL(baseUrl);
  url.searchParams.append('api-key', apiKey);
  url.searchParams.append('format', 'json');
  url.searchParams.append('limit', '1');
  
  console.log('\nFull URL:', url.toString());
  console.log('\nFetching...\n');
  
  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    console.log('Status:', response.status, response.statusText);
    
    if (!response.ok) {
      const text = await response.text();
      console.log('Error response:', text);
      return;
    }
    
    const data = await response.json();
    console.log('\nAPI Response Structure:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.records && data.records.length > 0) {
      console.log('\n\nFirst Record Fields:');
      console.log(Object.keys(data.records[0]));
    }
    
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
}

testAPI();
