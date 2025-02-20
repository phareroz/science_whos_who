const schema_ping =
{
  summary: 'ping the app to check if alive',
  description: 'takes no parameters and returns a status 200 with no payload if the app is alive',
  response:
  {
    200:
    {
      description: 'Success, app responds to ping',
      type: 'null'
    }
  }
};

async function routes (fastify, options)
{
  fastify.get('/ping',
    {
      schema: schema_ping
    },
    async (request, reply) =>
    {
      return;
    }
  );
}

module.exports = routes;
