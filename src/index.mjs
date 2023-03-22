#!/usr/bin/env node
import * as dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import { run } from './jobs/gen-certs.mjs';

const CRON = process.env.CRON || (process.env.NODE_ENV === "development" ? "* * */1 * * *" : "*/5 * * * * *");

cron.schedule(CRON, async () => {
  await run()
})