
import { libraries, LocationSelector } from "@/components/basics/locationSelector";
import { useLoadScript } from "@react-google-maps/api";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { searchLocationByString } from "utils/googleMapsUtils";
import { LocationObject } from "utils/validation/types";

export const Route = createFileRoute('/app/')({
    component: Dashboard,

})



function Dashboard() {

    const [locationObject, setLocationObject] = useState<LocationObject | undefined>()


    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1
                className="text-4xl font-bold"
            >Dashboard</h1>
            {/* <LocationSelector locationObject={locationObject as any} setLocationObject={setLocationObject} /> */}

        </div>
    );
}
