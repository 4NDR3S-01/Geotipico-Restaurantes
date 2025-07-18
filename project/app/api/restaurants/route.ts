import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '5000';
    const type = searchParams.get('type') || 'restaurant';
    const keyword = searchParams.get('keyword') || '';

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Maps API key not configured' },
        { status: 500 }
      );
    }

    // Build Google Places API request
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const params = new URLSearchParams({
      location: `${lat},${lng}`,
      radius: radius,
      type: type,
      key: apiKey,
    });

    if (keyword) {
      params.append('keyword', keyword);
    }

    const response = await fetch(`${baseUrl}?${params}`);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch restaurants from Google Places API' },
        { status: 500 }
      );
    }

    // Transform the response
    const restaurants = data.results.map((place: any) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      rating: place.rating,
      price_level: place.price_level,
      types: place.types,
      photos: place.photos?.map((photo: any) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`
      ),
      opening_hours: place.opening_hours,
    }));

    return NextResponse.json({ restaurants });
  } catch (error) {
    console.error('Restaurants API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}