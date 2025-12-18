import { useNavigation } from 'react-router';
import { Button } from '../ui/button';
import { LoaderCircle } from 'lucide-react';

export default function DefaultButton({ text, allowed = true }: { text: string, allowed?: boolean,  }) {
    const { state } = useNavigation();
    const busy: boolean = state === "submitting" || state === "loading";

    return (
        <Button
            disabled={busy || !allowed}
            className="bg-primary rounded-full text-white text-sm hover:bg-gray-600 font-medium cursor-pointer w-full tracking-tight py-6 disabled:bg-gray-500 disabled:text-gray-200 disabled:cursor-not-allowed disabled:border-gray-500 "
        >
            {busy ? (<LoaderCircle className="animate-spin" />) : text}
        </Button>
    )
}
