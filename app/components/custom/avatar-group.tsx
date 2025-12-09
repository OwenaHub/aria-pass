import CustomAvatar from "./custom-avatar";

interface AvatarGroupProps {
    names: string[];
    max?: number;
}

export default function AvatarGroup({ names, max = names.length }: AvatarGroupProps) {
    const visibleNames = names.slice(0, max);
    const extraCount = names.length - max;

    return (
        <div className="flex items-center -space-x-3.5">
            {visibleNames.map((name, index) => (
                <CustomAvatar key={index} name={name} styles="md:size-9 size-10 text-sm" />
            ))}

            {extraCount > 0 && (
                <div className="ms-1 size-8 md:size-7 flex items-center justify-center rounded-full bg-primary-bg text-primary text-xs font-medium">
                    +{extraCount}
                </div>
             )}
        </div>
    );
}