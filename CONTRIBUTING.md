# Contributing

Thanks for wanting to improve Awesome Java Books! This repo powers both the
GitHub README and the [live site](https://mohsenk.github.io/JavaBooks/) — both
are generated from a single data file, so most contributions only touch one place.

## Suggest or update a book

All book data lives in [`docs/_data/books.yml`](docs/_data/books.yml). To add,
edit, or remove a book:

1. Fork the repo and edit `docs/_data/books.yml`.
2. Follow the existing field structure for each entry (`title`, `author`,
   `edition`, `year`, `isbn13`, `publisher`, `level`, `blurb`, `best_for`,
   `cover_image_url`, `purchase_links`).
3. Write an **original** 2-4 sentence `blurb` — please don't copy publisher or
   Amazon marketing copy.
4. For `cover_image_url`, prefer the Open Library covers API
   (`https://covers.openlibrary.org/b/isbn/{ISBN13}-L.jpg`) and verify the URL
   actually returns a real cover, not a blank placeholder.
5. Open a pull request explaining why the book belongs on the list (what gap
   it fills, who it's for).

## Preview the site locally

The live site is a Jekyll site in `docs/`:

```bash
cd docs
bundle install
bundle exec jekyll serve
```

Then open `http://localhost:4000/JavaBooks/`.

## Reporting problems

Broken links, outdated editions, or factual errors — please open an issue
with the book title and what's wrong.
