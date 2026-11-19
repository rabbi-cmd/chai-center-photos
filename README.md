# Chai Center photos

Photo hosting for the galleries on chabadhome.com. This site is not meant to be browsed directly.

## Adding an album

1. Folder: `YEAR/slug-YYYY-MM-DD/`, for example `2026/singalong-2026-11-13/`.
2. Full size photos: `01.jpg`, `02.jpg`, ... (two digit numbering, no gaps), long edge at most 1800px, JPEG quality about 82, progressive, EXIF/GPS removed (rotation applied first).
3. Thumbnails: same names inside `thumbs/`, long edge 600px, quality about 78.
4. The photo you want first (the cover) should be `01.jpg`.
5. Commit, push to `main`, and wait a minute for GitHub Pages.

The helper script `make_album.py` (kept on the bot's box at `/workspace/gallery/make_album.py`) does all of this:

    python3 make_album.py SOURCE_FOLDER SLUG YEAR --title "Event Title" --date "Month D, YYYY" [--first FILE]

## Embed snippet (Chabad Suite Embed block)

    <div class="cc-gallery" data-base="https://rabbi-cmd.github.io/chai-center-photos/2026/singalong-2026-11-13/" data-count="68" data-title="Pre Shabbat Sing Along" data-date="November 13, 2026"></div>
    <script src="https://rabbi-cmd.github.io/chai-center-photos/gallery.js?v=1"></script>

Change `data-base`, `data-count`, `data-title`, `data-date` per album. Several galleries can share one page; `gallery.js` renders every `.cc-gallery` element and shares one lightbox. When `gallery.js` changes, bump `?v=` in the snippets to bust caches.
