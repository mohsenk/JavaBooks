module.exports = {
  totalBooks: (data) => data.books.reduce((sum, cat) => sum + cat.books.length, 0),
  buildTime: () => new Date(),
};
