import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { InMemoryPilotStore } from './pilotStore';
import { Drone, Pilot } from './types';

const droneUrl = 'http://assignments.reaktor.com/birdnest/drones';
const pilotUrl = 'http://assignments.reaktor.com/birdnest/pilots/';
const xmlParser = new XMLParser();
const pilotStore = new InMemoryPilotStore();

const noFlyRadius = 100_000;
const noFlyX = 250_000;
const noFlyY = 250_000;


function distanceToNoFlyZone(droneX: number, droneY: number) : number {
    return Math.sqrt(
        Math.pow(droneX - noFlyX, 2) + Math.pow(droneY - noFlyY, 2)
    );
}

function isInNoFlyZone(droneX: number, droneY: number): boolean {
    const distance = distanceToNoFlyZone(droneX, droneY);

    console.log(droneX, droneY, distance);

    return distance <= noFlyRadius
}

async function getPilot(serialNumber: string) : Promise<Pilot | null> {
    const response = await axios.get(pilotUrl + serialNumber);

    if (response.status != 200) return null;

    return response.data;
}

export async function updatePilotData() : Promise<boolean> {
    const response = await axios.get(droneUrl);
    const jsonData = xmlParser.parse(response.data);
    const drones: Drone[] = jsonData.report.capture.drone;

    const violatingPilots: Pilot[] = [];

    for (let drone of drones) {
        const existingPilot = pilotStore.getPilot(drone.serialNumber);
        const distance = distanceToNoFlyZone(drone.positionX, drone.positionY);
        if (distance <= noFlyRadius) {
            if (existingPilot) {
                existingPilot.closestDistanceToNest = Math.min(existingPilot.closestDistanceToNest, distance);
                existingPilot.drone = drone;

                pilotStore.addOrUpdatePilot(drone.serialNumber, existingPilot);
                continue;
            }

            const newPilot = await getPilot(drone.serialNumber);
            if (!newPilot) continue;

            newPilot.closestDistanceToNest = distance;
            newPilot.drone = drone;
            pilotStore.addOrUpdatePilot(drone.serialNumber, newPilot);
        }
    }

    return true;
}

export function getPilots() : Pilot[] {
    return pilotStore.getPilots();
}
