import { ChevronDown } from "lucide-react"
import { useSearchParams } from "react-router"; // or "react-router-dom" depending on your version

import { Button } from "~/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

export function FeedFilter() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentFilter = searchParams.get("filter") || "upcoming";

    const getLabel = (value: string) => {
        switch (value) {
            case 'all': return 'All Events';
            case 'upcoming': return 'Upcoming';
            default: return 'Upcoming';
        }
    }

    const handleValueChange = (newValue: string) => {
        // Update params while preserving other existing params (like ?type=Concert)
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set("filter", newValue);
            return newParams;
        });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2 w-40 px-10 py-5 items-center justify-between rounded-full">
                    <span>{getLabel(currentFilter)}</span>
                    <ChevronDown size={14} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-min relative">
                <DropdownMenuRadioGroup value={currentFilter} onValueChange={handleValueChange}>
                    <DropdownMenuRadioItem value="upcoming">Upcoming</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="all">All Events</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="organisers" disabled>Organisers</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}