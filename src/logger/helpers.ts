export function formatDate(date: Date | undefined): string | undefined {
    return date && `${date.toLocaleString()}.${date.getMilliseconds()}`;
}

export function getDuration(start: Date | undefined, end: Date | undefined): string | undefined {
    return start && end && `${end.getMilliseconds() - start.getMilliseconds()} ms`;
}
