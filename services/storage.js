export async function fetchTransactions() {
  try {
    const res = await fetch('https://mocki.io/v1/7df2044a-4a6c-4904-8349-a82555cf6808');
    const json = await res.json();
   return json.transactions || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}
