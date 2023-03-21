#!/usr/bin/env node
import cron from 'node-cron';
import { run } from './jobs/gen-certs.mjs';

const CRON = process.env.CRON || (process.env.MODE === "production" ? "*/5 * * * * *" : "* * */1 * * *");

cron.schedule(CRON, async () => {
  await run()
})