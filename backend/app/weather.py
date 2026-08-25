import json
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/api/weather", tags=["weather"])

WMO_CODE_MAP = {
    0: {"label": "Sunny / Clear Sky", "description": "Bright sunny skies, optimal solar radiation"},
    1: {"label": "Mainly Clear", "description": "Mostly clear with plenty of sunshine"},
    2: {"label": "Partly Cloudy", "description": "Scattered cloud cover with sunny intervals"},
    3: {"label": "Overcast", "description": "Dense cloud cover, reduced solar exposure"},
    45: {"label": "Fog & Mist", "description": "Reduced visibility with morning condensation"},
    48: {"label": "Depositing Rime Fog", "description": "Freezing dense fog"},
    51: {"label": "Light Drizzle", "description": "Gentle precipitation, mild leaf surface wetting"},
    53: {"label": "Moderate Drizzle", "description": "Moderate drizzle"},
    55: {"label": "Dense Drizzle", "description": "Continuous drizzle"},
    61: {"label": "Light Rain", "description": "Substantial rainfall; soil moisture enrichment"},
    63: {"label": "Moderate Rain", "description": "Moderate continuous rainfall"},
    65: {"label": "Heavy Rain", "description": "Heavy downpour, check soil drainage"},
    80: {"label": "Light Rain Showers", "description": "Intermittent light rain showers"},
    81: {"label": "Moderate Showers", "description": "Moderate showers"},
    82: {"label": "Violent Rain Showers", "description": "Intense torrential showers"},
    95: {"label": "Thunderstorm", "description": "Lightning and gusty winds, suspend field operations"},
    96: {"label": "Thunderstorm with Slight Hail", "description": "Hail risk, protect crops and nurseries"},
    99: {"label": "Thunderstorm with Heavy Hail", "description": "Severe storm with destructive hail"},
}

PRESET_FARM_LOCATIONS = [
    {
        "id": "farm-1",
        "name": "Nashik",
        "admin1": "Maharashtra",
        "country": "India",
        "latitude": 19.9975,
        "longitude": 73.7898,
        "farmName": "Green Acre Farm (Nashik)",
    },
    {
        "id": "farm-2",
        "name": "Ludhiana",
        "admin1": "Punjab",
        "country": "India",
        "latitude": 30.9010,
        "longitude": 75.8573,
        "farmName": "Sunrise Plot (Ludhiana)",
    },
    {
        "id": "farm-3",
        "name": "Varanasi",
        "admin1": "Uttar Pradesh",
        "country": "India",
        "latitude": 25.3176,
        "longitude": 82.9739,
        "farmName": "Riverbed Field (Varanasi)",
    },
    {
        "id": "farm-4",
        "name": "Guntur",
        "admin1": "Andhra Pradesh",
        "country": "India",
        "latitude": 16.3067,
        "longitude": 80.4365,
        "farmName": "Krishna Delta Farm (Guntur)",
    },
    {
        "id": "farm-5",
        "name": "Indore",
        "admin1": "Madhya Pradesh",
        "country": "India",
        "latitude": 22.7196,
        "longitude": 75.8577,
        "farmName": "Malwa Plateau Farm (Indore)",
    },
    {
        "id": "farm-6",
        "name": "Mandya",
        "admin1": "Karnataka",
        "country": "India",
        "latitude": 12.5238,
        "longitude": 76.8967,
        "farmName": "Cauvery Basin Farm (Mandya)",
    },
]


def _http_get_json(url: str, timeout: int = 10) -> Dict[str, Any]:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "SIH-Smart-Agriculture-Platform/1.0"},
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        if resp.status != 200:
            raise HTTPException(
                status_code=resp.status,
                detail=f"External Weather API error (HTTP {resp.status})",
            )
        data = resp.read().decode("utf-8")
        return json.loads(data)


@router.get("/presets")
def get_presets() -> List[Dict[str, Any]]:
    """Return preconfigured agricultural hub locations."""
    return PRESET_FARM_LOCATIONS


@router.get("/search")
def search_locations(q: str = Query(..., min_length=2, description="Location search query")) -> List[Dict[str, Any]]:
    """Search farm locations via free Open-Meteo Geocoding API."""
    encoded_query = urllib.parse.quote(q.strip())
    url = f"https://geocoding-api.open-meteo.com/v1/search?name={encoded_query}&count=8&language=en&format=json"

    try:
        data = _http_get_json(url)
        results = data.get("results", [])
        return [
            {
                "id": item.get("id"),
                "name": item.get("name"),
                "admin1": item.get("admin1"),
                "country": item.get("country"),
                "latitude": item.get("latitude"),
                "longitude": item.get("longitude"),
                "farmName": f"{item.get('name')}{', ' + item.get('admin1') if item.get('admin1') else ''}",
            }
            for item in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Location geocoding error: {str(e)}")


@router.get("/forecast")
def get_weather_forecast(
    latitude: float = Query(..., description="Latitude of farmer location"),
    longitude: float = Query(..., description="Longitude of farmer location"),
    farm_name: Optional[str] = Query(None, description="Optional farm name"),
) -> Dict[str, Any]:
    """
    Fetch comprehensive weather forecast & AI agricultural advisories for farmer location
    using free Open-Meteo API.
    """
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={latitude}&longitude={longitude}&"
        f"current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&"
        f"hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,visibility,wind_speed_10m,uv_index,is_day&"
        f"daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant,et0_fao_evapotranspiration&"
        f"timezone=auto"
    )

    try:
        raw = _http_get_json(url)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch forecast from Open-Meteo: {str(e)}")

    current_raw = raw.get("current", {})
    weather_code = current_raw.get("weather_code", 0)
    cond_info = WMO_CODE_MAP.get(weather_code, {"label": "Clear / Mild", "description": "Normal conditions"})

    current_data = {
        "temperature": round(current_raw.get("temperature_2m", 25)),
        "apparentTemperature": round(current_raw.get("apparent_temperature", 25)),
        "humidity": current_raw.get("relative_humidity_2m", 60),
        "precipitation": current_raw.get("precipitation", 0),
        "rain": current_raw.get("rain", 0),
        "weatherCode": weather_code,
        "condition": cond_info["label"],
        "windSpeed": round(current_raw.get("wind_speed_10m", 10)),
        "windDirection": current_raw.get("wind_direction_10m", 0),
        "surfacePressure": round(current_raw.get("surface_pressure", 1013)),
        "cloudCover": current_raw.get("cloud_cover", 20),
        "isDay": bool(current_raw.get("is_day", 1)),
        "time": current_raw.get("time", ""),
    }

    # Generate agricultural advisories
    daily_raw = raw.get("daily", {})
    hourly_raw = raw.get("hourly", {})

    today_rain_sum = daily_raw.get("precipitation_sum", [0])[0] if daily_raw.get("precipitation_sum") else 0
    today_et0 = daily_raw.get("et0_fao_evapotranspiration", [3.5])[0] if daily_raw.get("et0_fao_evapotranspiration") else 3.5
    next_3d_rain = sum(daily_raw.get("precipitation_sum", [0, 0, 0])[:3])

    # Spraying window
    wind_speed = current_data["windSpeed"]
    if wind_speed > 20:
        spray_status = "unfavorable"
        spray_title = "High Wind Drift Warning"
        spray_msg = f"Wind speed ({wind_speed} km/h) is too high. Foliar sprays will drift."
    elif today_rain_sum > 3:
        spray_status = "unfavorable"
        spray_title = "Rain Wash-off Alert"
        spray_msg = f"Precipitation ({today_rain_sum} mm) will wash away chemical applications."
    else:
        spray_status = "favorable"
        spray_title = "Optimal Spraying Window"
        spray_msg = "Calm winds and low wash-off risk. Ideal conditions for pesticide/fertilizer spray."

    # Irrigation
    if next_3d_rain > 15:
        irrig_status = "skip"
        irrig_title = "Hold Off Irrigation (Rain Forecast)"
        irrig_advice = f"Substantial rainfall ({round(next_3d_rain, 1)} mm) expected in next 3 days."
    elif current_data["temperature"] > 36:
        irrig_status = "irrigate"
        irrig_title = "High Heat Evaporation Demand"
        irrig_advice = f"High ambient temperature ({current_data['temperature']}°C). Deep morning irrigation advised."
    else:
        irrig_status = "irrigate"
        irrig_title = "Standard Irrigation Recommended"
        irrig_advice = f"Reference crop evapotranspiration loss is {today_et0} mm/day."

    # Disease risk
    humidity = current_data["humidity"]
    temp = current_data["temperature"]
    if humidity > 78 and 20 <= temp <= 32:
        disease_level = "high"
        disease_title = "High Fungal / Blight Risk"
        disease_desc = f"Warm temperature ({temp}°C) and high humidity ({humidity}%) accelerate fungal spore germination."
    else:
        disease_level = "low"
        disease_title = "Low Climate Disease Pressure"
        disease_desc = "Current atmospheric humidity is unfavorable for rapid foliar blight spread."

    return {
        "location": {
            "latitude": latitude,
            "longitude": longitude,
            "farmName": farm_name or f"Farm ({latitude:.2f}°, {longitude:.2f}°)",
        },
        "current": current_data,
        "daily": daily_raw,
        "hourly": hourly_raw,
        "advisories": {
            "spraying": {"status": spray_status, "title": spray_title, "message": spray_msg},
            "irrigation": {"status": irrig_status, "title": irrig_title, "advice": irrig_advice, "expectedRainfallMm": next_3d_rain, "evapotranspirationMm": today_et0},
            "diseaseRisk": {"level": disease_level, "title": disease_title, "riskFactor": disease_desc},
        },
    }
