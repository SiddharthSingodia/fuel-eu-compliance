import express from 'express';
import http from 'http';
const app = express();
app.use(express.json());
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
const server = http.createServer(app);
const port = process.env.PORT ?? 4000;
server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend dev server listening on http://localhost:${port}`);
});
export default server;
