import swaggerAutogen from 'swagger-autogen';
const swagger = swaggerAutogen();

const outputFile = './swagger.json';
const endpointsFiles = [
  '../Infrastructure/Routes/UserRoutes.ts',
  '../Server.ts',
];

swagger(outputFile, endpointsFiles);
