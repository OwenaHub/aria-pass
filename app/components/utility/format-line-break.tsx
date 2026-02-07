export function FormatLineBreak({ input }: { input: string | null }) {
    return (input ?? '').split('\n').map((line: string, index: number) => (
        <p key={index} className="text-wrap min-h-4.5">
            {/* If line is empty, render a break to force the height, otherwise render text */}
            {line === "" ? <br /> : line}
        </p>
    ));
}