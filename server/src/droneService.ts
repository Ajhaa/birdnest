import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { InMemoryPilotStore } from './pilotStore';
import { Drone, Pilot } from './types';

const droneUrl = 'http://assignments.reaktor.com/birdnest/drones';
const pilotUrl = 'http://assignments.reaktor.com/birdnest/pilots/';

const xmlParser = new XMLParser();
const pilotStore = new InMemoryPilotStore();

const noFlyRadius = 100_000;
// location of the center of the no fly zone
const noFlyX = 250_000;
const noFlyY = 250_000;


function distanceToNoFlyZone(droneX: number, droneY: number) : number {
    return Math.sqrt(
        Math.pow(droneX - noFlyX, 2) + Math.pow(droneY - noFlyY, 2)
    );
}

function isInNoFlyZone(droneX: number, droneY: number): boolean {
    const distance = distanceToNoFlyZone(droneX, droneY);
    return distance <= noFlyRadius
}

async function getPilotFromApi(serialNumber: string) : Promise<Pilot | null> {
    const response = await axios.get(pilotUrl + serialNumber);

    if (response.status != 200) return null;

    return response.data;
}

async function getDronesFromApi() : Promise<Drone[]> {
    const response = await axios.get(droneUrl);
    const jsonData = xmlParser.parse(response.data);
    const drones: Drone[] = jsonData.report.capture.drone;

    return drones;
}

export async function updatePilotData() : Promise<boolean> {
    const drones = await getDronesFromApi();

    for (let drone of drones) {
        const distance = distanceToNoFlyZone(drone.positionX, drone.positionY);
        const existingPilot = pilotStore.getPilot(drone.serialNumber);

        // keep an existing pilot in the system even if they don't break the no fly zone
        if (existingPilot) {
            existingPilot.closestDistanceToNest = Math.min(existingPilot.closestDistanceToNest, distance);
            existingPilot.drone = drone;

            pilotStore.addOrUpdatePilot(drone.serialNumber, existingPilot);
            continue;
        }

        if (distance <= noFlyRadius) {
            const newPilot = await getPilotFromApi(drone.serialNumber);
            if (!newPilot) continue;

            newPilot.closestDistanceToNest = distance;
            newPilot.drone = drone;
            pilotStore.addOrUpdatePilot(drone.serialNumber, newPilot);
        }
    }

    return true;
}

export function getPilots() : Pilot[] {
    return pilotStore
        .getPilots()
        .sort((p1, p2) => p2.updatedAt - p1.updatedAt);
}
