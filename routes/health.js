const schema_health =
{
  summary: 'chack the app health',
  description: 'takes no parameters and returns a status 200 with health info',
  response:
  {
    200:
    {
      description: 'Success, app health is good',
      type: 'object',
      properties:
      {
        statusCode: { type: 'integer' },
        message: { type: 'string' }
      },
      examples:
      [
        { statusCode: 200, message: 'ok' }
      ]
    }
  }
};

async function routes (fastify, options)
{
  fastify.get('/health',
    {
      schema: schema_health
    },
    async (request, reply) =>
    {
      return { statusCode:200, message:'ok' };
    }
  );
}

module.exports = routes;
