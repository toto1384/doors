import mongoose from 'mongoose';
import { PropertyObject } from '../validation/types';

let cached = (global as any).mongoose

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null }
}



async function dbConnect<T extends boolean>(): Promise<T extends true ? { autoIncrement: any, conn: typeof mongoose } : typeof mongoose> {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise || !cached.autoIncrement) {
        console.log('generating mongo instance')

        //IF TEST, THEN SHOW CONNECTION TEST, SHOW NORMAL IF NOT
        console.log('connecting to mongodb', process.env.VITE_TEST === 'positive' ? process.env.MONGODB_CONNECTION_TEST! : process.env.MONGODB_CONNECTION_URI!)
        const connection = await mongoose.connect(process.env.VITE_TEST === 'positive' ? process.env.MONGODB_CONNECTION_TEST! : process.env.MONGODB_CONNECTION_URI!);
        cached.promise = connection

        // const autoIncrement = AutoIncrementFactory(connection)
        // cached.autoIncrement = autoIncrement
    }

    cached.conn = await cached.promise

    return cached.conn
}


export function getPropertyObject() {
    // Romanian cities and locations for varied data
    const romanianCities = [
        { city: "București", state: "București", stateShort: "B", lat: 44.4268, lng: 26.1025 },
        { city: "Cluj-Napoca", state: "Cluj", stateShort: "CJ", lat: 46.7712, lng: 23.6236 },
        { city: "Timișoara", state: "Timiș", stateShort: "TM", lat: 45.7489, lng: 21.2087 },
        { city: "Iași", state: "Iași", stateShort: "IS", lat: 47.1585, lng: 27.6014 },
        { city: "Constanța", state: "Constanța", stateShort: "CT", lat: 44.1598, lng: 28.6348 },
        { city: "Craiova", state: "Dolj", stateShort: "DJ", lat: 44.3302, lng: 23.7949 },
        { city: "Brașov", state: "Brașov", stateShort: "BV", lat: 45.6427, lng: 25.5887 },
        { city: "Galați", state: "Galați", stateShort: "GL", lat: 45.4353, lng: 28.0080 },
        { city: "Ploiești", state: "Prahova", stateShort: "PH", lat: 44.9414, lng: 26.0063 },
        { city: "Oradea", state: "Bihor", stateShort: "BH", lat: 47.0465, lng: 21.9189 }
    ];

    const streetNames = [
        "Strada Victoriei", "Bulevardul Magheru", "Strada Ion Campineanu",
        "Strada Republicii", "Bulevardul Eroilor", "Strada Mihai Viteazul",
        "Strada Eminescu", "Strada Kogălniceanu", "Bulevardul Ferdinand"
    ];

    const propertyTitles = [
        "Apartament modern cu vedere la oraș",
        "Casă spațioasă cu grădină mare",
        "Penthouse de lux cu terasă",
        "Apartament mobilat complet central",
        "Vilă elegantă cu piscină",
        "Studio modern pentru tineri",
        "Apartament renovat recent",
        "Casă tradițională românească",
        "Apartament cu balcon mare",
        "Duplex cu design contemporan"
    ];

    const descriptions = [
        "Proprietate excepțională situată într-o zonă liniștită și accesibilă. Oferă toate facilitățile moderne necesare pentru o viață confortabilă.",
        "Imobil de calitate superioară cu finisaje premium și dotări complete. Locație ideală pentru familii sau profesioniști.",
        "Spațiu generos și luminos cu vedere panoramică. Parcare inclusă și acces facil la transportul în comun.",
        "Proprietate renovată recent cu materiale de cea mai bună calitate. Zonă verde și liniștită, perfectă pentru relaxare.",
        "Imobil elegant cu arhitectură modernă și facilități de top. Investiție ideală într-o locație premium.",
        "Casă cu grădină mare și spații largi, perfectă pentru petrecerea timpului în familie. Zona foarte accesibilă.",
        "Apartament cu design contemporan și dotări moderne complete. Locație centrală cu acces rapid la toate serviciile.",
        "Proprietate unică cu caracter și personalitate. Combinația perfectă între tradiție și modernitate.",
        "Spațiu de locuit confortabil cu toate facilitățile necesare. Zonă liniștită și sigură pentru întreaga familie."
    ];

    const features = ['balcony', 'terrace', 'garden', 'swimming_pool', 'gym', 'elevator', 'air_conditioning', 'heating', 'fireplace', 'security_system', 'internet', 'cable_tv', 'dishwasher', 'washing_machine', 'dryer', 'microwave', 'refrigerator', 'pet_friendly', 'wheelchair_accessible'];
    const statuses = ['available', 'sold', 'pending', 'rented', 'off-market'];
    const parkingTypes = ['garage', 'driveway', 'street', 'covered', 'underground'];
    const tags = ['nou', 'renovat', 'premium', 'central', 'linistit', 'verde', 'modern', 'traditional', 'investitie', 'familie'];

    // Select random city
    const selectedCity = romanianCities[Math.floor(Math.random() * romanianCities.length)];
    const streetNumber = Math.floor(Math.random() * 200) + 1;
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];

    const propertyTypes = ['apartment', 'house', 'hotel', 'office'];
    const heatingTypes = ['gas', 'fireplace', 'electric', '3rd_party'];
    const currencies = ['EUR', 'RON', 'USD'];

    const propObject: PropertyObject = {
        _id: new mongoose.Types.ObjectId().toString() as any,
        title: propertyTitles[Math.floor(Math.random() * propertyTitles.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        price: {
            value: Math.floor(Math.random() * 500000) + 50000, // 50k to 550k
            currency: currencies[Math.floor(Math.random() * currencies.length)] as any
        },
        location: {
            streetAddress: `${streetName} ${streetNumber}`,
            country: "România",
            countryShort: "RO",
            zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
            city: selectedCity.city,
            state: selectedCity.state,
            stateShort: selectedCity.stateShort,
            latitude: selectedCity.lat + (Math.random() - 0.5) * 0.1, // Add some variation
            longitude: selectedCity.lng + (Math.random() - 0.5) * 0.1,
            fullLocationName: `${streetName} ${streetNumber}, ${selectedCity.city}, ${selectedCity.state}, România`
        },
        numberOfRooms: Math.floor(Math.random() * 8) + 1, // 1 to 8 rooms
        surfaceArea: Math.floor(Math.random() * 300) + 30, // 30 to 330 sqm
        furnished: Math.random() > 0.5,
        features: features.slice(0, Math.floor(Math.random() * 6) + 1).sort(() => Math.random() - 0.5),
        propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)] as any,
        heating: heatingTypes[Math.floor(Math.random() * heatingTypes.length)] as any,
        buildingYear: Math.floor(Math.random() * 54) + 1970, // 1970 to 2024
        buildingFloors: Math.floor(Math.random() * 20) + 1, // 1 to 20 floors
        floor: Math.floor(Math.random() * 15) + 1, // 1 to 15th floor
        parking: {
            available: Math.random() > 0.3, // 70% chance of having parking
            spaces: Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 1 : undefined,
            type: Math.random() > 0.3 ? parkingTypes[Math.floor(Math.random() * parkingTypes.length)] as any : undefined
        },
        imageUrls: [
            "https://images.unsplash.com/photo-1757530592693-eddd9a1f3f5a?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1757530592693-eddd9a1f3f5a?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1757530592693-eddd9a1f3f5a?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ],
        tags: tags.slice(0, Math.floor(Math.random() * 4) + 1).sort(() => Math.random() - 0.5),
        postedDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000), // Random date in last 90 days
        postedByUserId: '-1',
        status: statuses[Math.floor(Math.random() * statuses.length)] as any
    } as PropertyObject;
    return propObject;
}

export default dbConnect
