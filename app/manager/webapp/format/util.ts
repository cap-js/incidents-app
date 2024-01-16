import MessageType from "sap/ui/core/message/MessageType";

export enum Urgency {
    High = 'H',
    Medium = 'M',
    Low = 'L'
}

export function formatHighlightColor(urgency: Urgency): MessageType {

    if (urgency === Urgency.High) { return MessageType.Error; }
    else if (urgency === Urgency.Medium) { return MessageType.Warning; }
    return MessageType.Information;

}


export function formatDaysAgo(createdAt: Date): string {
    const today = new Date();
    const since = new Date(createdAt);
    const diff = Math.abs(since.getTime() - today.getTime());
    const diffD = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (diffD <= 1) { return `${diffD} day ago`; }
    return `${diffD} days ago`;
}