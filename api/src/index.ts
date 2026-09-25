import { buildApp } from './app';
import { config } from './config';
import { migrate } from './db';

await migrate();
buildApp().listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
