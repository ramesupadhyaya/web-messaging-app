// Handle uncaught exceptions
process.on('uncaughtException', async function(error) {
  console.error(error);

  // TODO we can implement email sender here to notify owner that
  // app failed
});

// Handle unhandled exceptions
process.on('unhandledRejection', async function(error) {
  console.error(error);
  // TODO we can implement email sender here to notify owner that
  // app failed
  throw error;
});
