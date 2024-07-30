export type ClientType = "server" | "user";

function validateClientType(value: string | null): value is ClientType {
    return value === "server" || value === "user";
}

export function getClientType(headers: Headers): ClientType | null {
    const clientType = headers.get("X-Client-Type")?.toLowerCase();
    if (validateClientType(clientType)) {
        return clientType;
    }
    return null;
}
