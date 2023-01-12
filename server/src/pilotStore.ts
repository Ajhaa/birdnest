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

    // TODO check expiration here also!
    getPilot(serialNumber: string) : Pilot | null {
        const pilot = this.pilots[serialNumber];
        if (!pilot) return null;

        if (new Date().getTime() - pilot.updatedAt > this.pilotPersistTimeMilliseconds) {
            delete this.pilots[serialNumber];
            return null;
        }

        return pilot;
    }

    getPilots() : Pilot[] {
        const pilots = [];
        for (let serialNumber of Object.keys(this.pilots)) {
            const pilot = this.getPilot(serialNumber);
            if (pilot !== null) pilots.push(pilot);
        }

        return pilots;

    }
}
