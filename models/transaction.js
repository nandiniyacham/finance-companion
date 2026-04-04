export default class Transaction {
  constructor(amount, type, category, date, notes = "") {
    this.amount = amount;
    this.type = type; // income or expense
    this.category = category;
    this.date = date;
    this.notes = notes;
  }
}