export async function fetchReminders() {
  try {
    const res = await fetch('https://mocki.io/v1/7df2044a-4a6c-4904-8349-a82555cf6808');
    const json = await res.json();
    return json.reminders;
  } catch (err) {
    console.error(err);
    return [];
  }
}
