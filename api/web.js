"use strict";

function getfastifyoptions()
{
  const pino = require('pino');
  const fastifyoptions = {};
  fastifyoptions.logger =
  {
    level: 'warn',
    formatters: { level: (label) => { return { level: label }; } },
    timestamp: pino.stdTimeFunctions.isoTime
  };
  return fastifyoptions;
}

function registerfastifyroutes(fastify)
{
  fastify.register(require('../routes/ping'));
  fastify.register(require('../routes/health'));
}

async function start(fastify)
{
  fastify.addHook('onRequest', (request, reply, done) =>
  {
    reply.header('set-cookie', 'swwapi=' + process.env.SWWAPI + '; SameSite=Strict');
    done();
  });
  const path = require('node:path');
  fastify.register(require('@fastify/static'),
  {
    root: path.join(__dirname, '../public'),
    index: 'app.html'
  });
  registerfastifyroutes(fastify);
}

const fastify = require('fastify')(getfastifyoptions());
start(fastify);

export default async (req, res) =>
{
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
