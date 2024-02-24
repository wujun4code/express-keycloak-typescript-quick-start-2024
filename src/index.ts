import 'dotenv/config'
import express, { Request, Response } from 'express';
import Keycloak from 'keycloak-connect';
import cors from 'cors';

const app = express();

const keycloakConfig = {
    "confidential-port": 0,
    "realm": process.env.KEYCLOAK_REALM,
    "auth-server-url": `${process.env.KEYCLOAK_URL}`,
    "ssl-required": "external",
    "resource": process.env.KEYCLOAK_CLIENT,
    "bearer-only": true
}

const keycloak = new Keycloak({}, keycloakConfig);
app.use(keycloak.middleware());
app.use(express.json());
app.use(cors());

// routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/secured', keycloak.protect('realm:user'), (req: Request, res: Response) => {
    res.json({
        message: "secured connection established.",
        status: "success"
    }).status(200);
});

app.get('/admin', keycloak.protect('realm:admin'), (req: Request, res: Response) => {
    res.json({
        message: "admin connection established.",
        status: "success"
    }).status(200);
});

// some more stuff

const APP_PORT = 3000;

app.listen(APP_PORT, () => {
    console.log(`🍗 Server started on port ${APP_PORT}`);
});

// end