#!/usr/bin/env node
import * as dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import { run } from './jobs/gen-certs.mjs';

const CRON = process.env.CRON || (process.env.NODE_ENV === "production" ? "*/5 * * * * *" : "* * */1 * * *");

cron.schedule(CRON, async () => {
  await run()
})