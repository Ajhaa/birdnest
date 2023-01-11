import express, { Express, Request, Response } from 'express';
import { getPilots, updatePilotData } from './droneService';
import cors from 'cors';

const app: Express = express();
app.use(cors());

const hostPort = process.env.PORT || '3000';

function pilotDataUpdate() {
    console.log('updating pilot data');
    updatePilotData()
        .catch(e => {
            console.log('pilot data update failed', e);
        })
        .finally(() => {
            setTimeout(() => {
                pilotDataUpdate();
            }, 2000);
        });
}


app.get('/pilots', async (_req: Request, res: Response) => {
    const data = getPilots();
    res.json(data);
});

app.listen(hostPort, () => {
    pilotDataUpdate();
    console.log('Birdnest running in port', hostPort);
});
