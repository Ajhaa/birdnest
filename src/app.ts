import express, { Express, Request, Response } from 'express';
import { getPilots, updatePilotData } from './droneService';

const app: Express = express();
const hostPort = process.env.PORT || '3000';

function pilotDataUpdate() {
    console.log('updating pilot data');
    updatePilotData().then(() => {
        setTimeout(() => {
            pilotDataUpdate();
        }, 2000);
    });
}


app.get('/', async (_req: Request, res: Response) => {
    const data = getPilots();
    res.json(data);
});

app.listen(hostPort, () => {
    pilotDataUpdate();
    console.log('Birdnest running in port', hostPort);
});
