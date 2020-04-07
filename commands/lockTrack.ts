async function lockTrack(): Promise<void> {

}

lockTrack().catch(err => {
  console.error(err);
  process.exit(1);
});
