import { Pilot } from "./types";

interface PilotStore {
    addOrUpdatePilot: (serialNumber: string, pilot: Pilot) => void;
    getPilots: () => Pilot[];
    getPilot: (serialNumber: string) => Pilot | null;
}

export class InMemoryPilotStore implements PilotStore {
    pilotPersistTimeMilliseconds: number;
    pilots: { [key: string]: Pilot } = {};

    constructor(persistTimeSeconds: number = 10 * 60) {
        this.pilotPersistTimeMilliseconds = persistTimeSeconds * 1000;
    }

    addOrUpdatePilot(serialNumber: string, pilot: Pilot) {
        pilot.updatedAt = new Date().getTime();
        this.pilots[serialNumber] = pilot;
    }

    getPilot(serialNumber: string) : Pilot | null {
        return this.pilots[serialNumber];
    }

    getPilots() : Pilot[] {
        const pilots = [];
        const currentTime = new Date().getTime();
        for (let [serialNumber, pilot] of Object.entries(this.pilots)) {
            if (currentTime - pilot.updatedAt > this.pilotPersistTimeMilliseconds) {
                delete this.pilots[serialNumber];
            } else {
                pilots.push(pilot);
            }
        }

        return pilots;

    }
}
