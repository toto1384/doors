import { Facilities } from "utils/validation/propertyFilters";
import { MultiSelect, MultiSelectContent, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "./ui/multi-select";
import { cn } from "lib/utils";



export function FacilitiesSelector({ className, facilities, setFacilities }: { className?: string, facilities: typeof Facilities[number][], setFacilities: (value: typeof Facilities[number][]) => void }) {
    return <MultiSelect values={facilities} onValuesChange={value => setFacilities(value as (typeof Facilities[number])[])}>
        <MultiSelectTrigger className={cn(" custor-pointer max-w-[87vw]", className)} >
            <MultiSelectValue className='cursor-pointer text-white ' placeholder="Facilities" />
        </MultiSelectTrigger>
        <MultiSelectContent>
            <MultiSelectItem value="parking">Parking</MultiSelectItem>
            <MultiSelectItem value="balcony">Balcony</MultiSelectItem>
            <MultiSelectItem value="terrace">Terrace</MultiSelectItem>
            <MultiSelectItem value="garden">Garden</MultiSelectItem>
            <MultiSelectItem value="elevator">Elevator</MultiSelectItem>
            <MultiSelectItem value="air-conditioning">Air conditioning</MultiSelectItem>
            <MultiSelectItem value="central-heating">Central heating</MultiSelectItem>
            <MultiSelectItem value="furnished">Furnished</MultiSelectItem>
            <MultiSelectItem value="internet">Internet</MultiSelectItem>
        </MultiSelectContent>
    </MultiSelect>
}
