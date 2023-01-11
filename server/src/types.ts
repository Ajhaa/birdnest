export interface Drone {
    serialNumber: string;
    model: string;
    manufacturer: string;
    mac: string;
    ipv4: string;
    ipv6: string;
    firmware: string;
    positionY: number;
    positionX: number;
    altitude: number;
}


export interface Pilot {
    pilotId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    updatedAt: number;
    closestDistanceToNest: number;
    drone: Drone;
}
