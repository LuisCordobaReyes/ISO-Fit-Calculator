export type MachineShop = {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  capabilities: string[];
  materials: string[];
  certifications: string[];
  website?: string;
};

export const CAPABILITY_TAGS = [
  "3-Axis CNC Mill",
  "5-Axis CNC Mill",
  "CNC Turning",
  "Swiss Turning",
  "EDM",
  "Grinding",
  "Sheet Metal",
  "Waterjet",
  "Laser Cutting",
  "Welding",
  "Additive / 3D Print",
  "Prototype",
  "Production",
] as const;

export const CERT_TAGS = [
  "ISO 9001",
  "AS9100",
  "ITAR",
  "ISO 13485",
  "IATF 16949",
  "NADCAP",
] as const;

export const MACHINE_SHOPS: MachineShop[] = [
  // West
  { id: "s1", name: "Protolabs", city: "Maple Plain", state: "MN", lat: 45.0074, lng: -93.6555, capabilities: ["3-Axis CNC Mill","CNC Turning","Additive / 3D Print","Prototype","Production"], materials: ["Aluminum","Steel","Stainless","Titanium","Plastics"], certifications: ["ISO 9001","AS9100","ITAR","ISO 13485"], website: "https://www.protolabs.com" },
  { id: "s2", name: "Xometry Partner Shop", city: "Gaithersburg", state: "MD", lat: 39.1434, lng: -77.2014, capabilities: ["3-Axis CNC Mill","5-Axis CNC Mill","CNC Turning","Sheet Metal"], materials: ["Aluminum","Steel","Stainless","Brass"], certifications: ["ISO 9001","AS9100","ITAR"], website: "https://www.xometry.com" },
  { id: "s3", name: "Fictiv Manufacturing", city: "San Francisco", state: "CA", lat: 37.7749, lng: -122.4194, capabilities: ["3-Axis CNC Mill","5-Axis CNC Mill","CNC Turning","Additive / 3D Print"], materials: ["Aluminum","Steel","Titanium","Plastics"], certifications: ["ISO 9001","ITAR"], website: "https://www.fictiv.com" },
  { id: "s4", name: "Hi-Tek Manufacturing", city: "Mason", state: "OH", lat: 39.3600, lng: -84.3097, capabilities: ["5-Axis CNC Mill","EDM","Grinding","Production"], materials: ["Inconel","Titanium","Stainless"], certifications: ["AS9100","NADCAP","ITAR"] },
  { id: "s5", name: "Moog Aircraft Group", city: "East Aurora", state: "NY", lat: 42.7681, lng: -78.6131, capabilities: ["5-Axis CNC Mill","CNC Turning","Grinding","Production"], materials: ["Titanium","Stainless","Aluminum"], certifications: ["AS9100","NADCAP","ITAR"] },
  { id: "s6", name: "Marlin Steel", city: "Baltimore", state: "MD", lat: 39.2904, lng: -76.6122, capabilities: ["Sheet Metal","Welding","Laser Cutting"], materials: ["Steel","Stainless"], certifications: ["ISO 9001"] },
  { id: "s7", name: "Mindful Design Consulting Shop", city: "Los Angeles", state: "CA", lat: 34.0522, lng: -118.2437, capabilities: ["3-Axis CNC Mill","Prototype","Additive / 3D Print"], materials: ["Aluminum","Plastics"], certifications: ["ISO 9001"] },
  { id: "s8", name: "Owens Industries", city: "Brookfield", state: "WI", lat: 43.0642, lng: -88.1064, capabilities: ["5-Axis CNC Mill","EDM","Grinding"], materials: ["Steel","Stainless","Tool Steel"], certifications: ["ISO 9001","AS9100"] },
  { id: "s9", name: "Turned Precision Products", city: "Meriden", state: "CT", lat: 41.5382, lng: -72.8070, capabilities: ["Swiss Turning","CNC Turning","Production"], materials: ["Brass","Stainless","Steel"], certifications: ["ISO 9001","ISO 13485"] },
  { id: "s10", name: "PBC Linear Machining", city: "Roscoe", state: "IL", lat: 42.4136, lng: -89.0092, capabilities: ["CNC Turning","3-Axis CNC Mill","Production"], materials: ["Aluminum","Steel"], certifications: ["ISO 9001","IATF 16949"] },
  { id: "s11", name: "Ace Precision Machining", city: "Oconomowoc", state: "WI", lat: 43.1075, lng: -88.4998, capabilities: ["Swiss Turning","CNC Turning"], materials: ["Stainless","Titanium"], certifications: ["ISO 9001","ISO 13485"] },
  { id: "s12", name: "American Axle Machining", city: "Detroit", state: "MI", lat: 42.3314, lng: -83.0458, capabilities: ["CNC Turning","Grinding","Production"], materials: ["Steel","Stainless"], certifications: ["IATF 16949","ISO 9001"] },
  { id: "s13", name: "Astro Manufacturing", city: "Eugene", state: "OR", lat: 44.0521, lng: -123.0868, capabilities: ["3-Axis CNC Mill","5-Axis CNC Mill","Waterjet"], materials: ["Aluminum","Stainless"], certifications: ["AS9100","ISO 9001"] },
  { id: "s14", name: "Boeing Machine Shop", city: "Everett", state: "WA", lat: 47.9790, lng: -122.2021, capabilities: ["5-Axis CNC Mill","Grinding","Production"], materials: ["Titanium","Aluminum","Inconel"], certifications: ["AS9100","NADCAP","ITAR"] },
  { id: "s15", name: "Lockheed Machining", city: "Fort Worth", state: "TX", lat: 32.7555, lng: -97.3308, capabilities: ["5-Axis CNC Mill","EDM"], materials: ["Titanium","Inconel"], certifications: ["AS9100","NADCAP","ITAR"] },
  { id: "s16", name: "Precision South", city: "Huntsville", state: "AL", lat: 34.7304, lng: -86.5861, capabilities: ["3-Axis CNC Mill","CNC Turning","Prototype"], materials: ["Aluminum","Steel","Titanium"], certifications: ["AS9100","ITAR"] },
  { id: "s17", name: "Rocky Mountain Machining", city: "Denver", state: "CO", lat: 39.7392, lng: -104.9903, capabilities: ["3-Axis CNC Mill","5-Axis CNC Mill","Prototype"], materials: ["Aluminum","Stainless"], certifications: ["ISO 9001"] },
  { id: "s18", name: "Sunbelt Precision", city: "Atlanta", state: "GA", lat: 33.7490, lng: -84.3880, capabilities: ["3-Axis CNC Mill","CNC Turning","Sheet Metal"], materials: ["Aluminum","Steel"], certifications: ["ISO 9001"] },
  { id: "s19", name: "Bayside Machining", city: "Tampa", state: "FL", lat: 27.9506, lng: -82.4572, capabilities: ["3-Axis CNC Mill","CNC Turning"], materials: ["Aluminum","Stainless","Brass"], certifications: ["ISO 9001"] },
  { id: "s20", name: "Cascade EDM & Grind", city: "Portland", state: "OR", lat: 45.5152, lng: -122.6784, capabilities: ["EDM","Grinding"], materials: ["Tool Steel","Carbide"], certifications: ["ISO 9001"] },
  { id: "s21", name: "Great Plains CNC", city: "Wichita", state: "KS", lat: 37.6872, lng: -97.3301, capabilities: ["3-Axis CNC Mill","CNC Turning","Production"], materials: ["Aluminum","Steel"], certifications: ["AS9100","ISO 9001"] },
  { id: "s22", name: "Alamo Aerospace Machining", city: "San Antonio", state: "TX", lat: 29.4241, lng: -98.4936, capabilities: ["5-Axis CNC Mill","Grinding"], materials: ["Titanium","Aluminum"], certifications: ["AS9100","ITAR"] },
  { id: "s23", name: "Twin Ports Fabrication", city: "Duluth", state: "MN", lat: 46.7867, lng: -92.1005, capabilities: ["Waterjet","Laser Cutting","Welding","Sheet Metal"], materials: ["Steel","Stainless"], certifications: ["ISO 9001"] },
  { id: "s24", name: "Yankee Precision", city: "Manchester", state: "NH", lat: 42.9956, lng: -71.4548, capabilities: ["Swiss Turning","CNC Turning","3-Axis CNC Mill"], materials: ["Stainless","Titanium","Brass"], certifications: ["ISO 13485","ISO 9001"] },
  { id: "s25", name: "Puget Sound Precision", city: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321, capabilities: ["3-Axis CNC Mill","5-Axis CNC Mill","Prototype"], materials: ["Aluminum","Titanium"], certifications: ["AS9100","ISO 9001"] },
  { id: "s26", name: "Motor City Tool & Die", city: "Warren", state: "MI", lat: 42.4775, lng: -83.0277, capabilities: ["EDM","Grinding","3-Axis CNC Mill"], materials: ["Tool Steel","Carbide"], certifications: ["IATF 16949","ISO 9001"] },
  { id: "s27", name: "Silicon Prototype Works", city: "San Jose", state: "CA", lat: 37.3382, lng: -121.8863, capabilities: ["Prototype","3-Axis CNC Mill","Additive / 3D Print"], materials: ["Aluminum","Plastics"], certifications: ["ISO 9001"] },
  { id: "s28", name: "Front Range Fabrication", city: "Colorado Springs", state: "CO", lat: 38.8339, lng: -104.8214, capabilities: ["Sheet Metal","Welding","Laser Cutting"], materials: ["Steel","Aluminum"], certifications: ["ISO 9001"] },
  { id: "s29", name: "Delta Machine Works", city: "New Orleans", state: "LA", lat: 29.9511, lng: -90.0715, capabilities: ["CNC Turning","Welding","Production"], materials: ["Stainless","Steel"], certifications: ["ISO 9001"] },
  { id: "s30", name: "Keystone Precision", city: "Pittsburgh", state: "PA", lat: 40.4406, lng: -79.9959, capabilities: ["5-Axis CNC Mill","Grinding","EDM"], materials: ["Tool Steel","Stainless"], certifications: ["AS9100","ISO 9001"] },
  { id: "s31", name: "Sooner Turning", city: "Oklahoma City", state: "OK", lat: 35.4676, lng: -97.5164, capabilities: ["CNC Turning","Swiss Turning"], materials: ["Brass","Steel","Aluminum"], certifications: ["ISO 9001"] },
  { id: "s32", name: "Piedmont CNC", city: "Charlotte", state: "NC", lat: 35.2271, lng: -80.8431, capabilities: ["3-Axis CNC Mill","CNC Turning","Prototype","Production"], materials: ["Aluminum","Stainless"], certifications: ["ISO 9001","AS9100"] },
  { id: "s33", name: "Sonoran Machining", city: "Phoenix", state: "AZ", lat: 33.4484, lng: -112.0740, capabilities: ["3-Axis CNC Mill","5-Axis CNC Mill","Waterjet"], materials: ["Aluminum","Titanium"], certifications: ["AS9100","ITAR"] },
  { id: "s34", name: "Great Lakes Precision", city: "Cleveland", state: "OH", lat: 41.4993, lng: -81.6944, capabilities: ["Grinding","EDM","3-Axis CNC Mill"], materials: ["Tool Steel","Stainless"], certifications: ["ISO 9001","AS9100"] },
  { id: "s35", name: "Ozark Manufacturing", city: "Springfield", state: "MO", lat: 37.2090, lng: -93.2923, capabilities: ["CNC Turning","3-Axis CNC Mill","Production"], materials: ["Aluminum","Steel"], certifications: ["ISO 9001"] },
  { id: "s36", name: "Empire Precision Plastics & Metals", city: "Rochester", state: "NY", lat: 43.1566, lng: -77.6088, capabilities: ["3-Axis CNC Mill","CNC Turning","Prototype"], materials: ["Plastics","Aluminum"], certifications: ["ISO 9001","ISO 13485"] },
  { id: "s37", name: "Bluegrass Machining", city: "Louisville", state: "KY", lat: 38.2527, lng: -85.7585, capabilities: ["3-Axis CNC Mill","CNC Turning"], materials: ["Steel","Aluminum"], certifications: ["ISO 9001","IATF 16949"] },
  { id: "s38", name: "Green Mountain Precision", city: "Burlington", state: "VT", lat: 44.4759, lng: -73.2121, capabilities: ["3-Axis CNC Mill","Prototype","Swiss Turning"], materials: ["Stainless","Brass"], certifications: ["ISO 13485"] },
  { id: "s39", name: "Big Sky Machining", city: "Bozeman", state: "MT", lat: 45.6770, lng: -111.0429, capabilities: ["3-Axis CNC Mill","CNC Turning","Prototype"], materials: ["Aluminum","Steel"], certifications: ["ISO 9001"] },
  { id: "s40", name: "Alaska Precision Works", city: "Anchorage", state: "AK", lat: 61.2181, lng: -149.9003, capabilities: ["3-Axis CNC Mill","Welding","Sheet Metal"], materials: ["Steel","Aluminum"], certifications: ["ISO 9001"] },
  { id: "s41", name: "Aloha Machining", city: "Honolulu", state: "HI", lat: 21.3069, lng: -157.8583, capabilities: ["3-Axis CNC Mill","CNC Turning"], materials: ["Aluminum","Stainless"], certifications: ["ISO 9001"] },
  { id: "s42", name: "Desert Aerospace CNC", city: "Las Vegas", state: "NV", lat: 36.1699, lng: -115.1398, capabilities: ["5-Axis CNC Mill","Grinding"], materials: ["Titanium","Aluminum"], certifications: ["AS9100","ITAR"] },
  { id: "s43", name: "Gulf Coast Machining", city: "Houston", state: "TX", lat: 29.7604, lng: -95.3698, capabilities: ["CNC Turning","Welding","Production"], materials: ["Stainless","Steel","Inconel"], certifications: ["ISO 9001","AS9100"] },
  { id: "s44", name: "Chicago Tool & Die", city: "Chicago", state: "IL", lat: 41.8781, lng: -87.6298, capabilities: ["EDM","Grinding","3-Axis CNC Mill"], materials: ["Tool Steel","Carbide"], certifications: ["ISO 9001","IATF 16949"] },
  { id: "s45", name: "Boston Precision Instruments", city: "Boston", state: "MA", lat: 42.3601, lng: -71.0589, capabilities: ["Swiss Turning","3-Axis CNC Mill","Prototype"], materials: ["Stainless","Titanium"], certifications: ["ISO 13485","ISO 9001"] },
];
