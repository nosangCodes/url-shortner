export default function getCooldownTime() {
  const nextDay = new Date(
    new Date(new Date().setDate(new Date().getDate() + 1)).setHours(0, 0, 0, 0)
  );
  const today = new Date();

  console.log(nextDay);
  console.log(today);

  const cooldownTime = nextDay - today;

  console.log("Cooldown Time in ms:", cooldownTime);

  const hours = Math.floor(cooldownTime / (1000 * 60 * 60));
  const minutes = Math.floor((cooldownTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((cooldownTime % (1000 * 60)) / 1000);

  const message = `Cooldown Time: ${hours}h ${minutes}m ${seconds}s`;
  return message;
}
