import { bootstrapApplication } from '@angular/platform-browser';
import { PlatformRef } from '@angular/core';
import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (options?: { platformRef: PlatformRef }) =>
  bootstrapApplication(App, config, options);

export default bootstrap;
