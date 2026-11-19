#!/usr/bin/env python3
"""Make a web album for chabadhome.com and publish it to rabbi-cmd/chai-center-photos.

Usage: make_album.py SOURCE_FOLDER SLUG YEAR --title "Title" --date "November 13, 2026" [--first FILENAME] [--no-push]
SLUG should include the date, e.g. singalong-2026-11-13.
"""
import argparse, os, re, subprocess, sys, time, urllib.request
from PIL import Image, ImageOps

REPO = 'rabbi-cmd/chai-center-photos'
CLONE = '/workspace/photosrepo'
PAGES = 'https://rabbi-cmd.github.io/chai-center-photos/'

def natkey(f):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r'(\d+)', f)]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('source'); ap.add_argument('slug'); ap.add_argument('year')
    ap.add_argument('--title', required=True); ap.add_argument('--date', required=True)
    ap.add_argument('--first', help='filename to make 01.jpg (cover)')
    ap.add_argument('--no-push', action='store_true')
    a = ap.parse_args()

    if not os.path.isdir(os.path.join(CLONE, '.git')):
        subprocess.run(['gh', 'repo', 'clone', REPO, CLONE], check=True)
    subprocess.run(['git', '-C', CLONE, 'pull', '-q'], check=True)

    files = sorted([f for f in os.listdir(a.source) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.heic', '.webp'))], key=natkey)
    if not files: sys.exit('no images found')
    if a.first:
        if a.first not in files: sys.exit('--first not found: ' + a.first)
        files.remove(a.first); files.insert(0, a.first)
    rel = f'{a.year}/{a.slug}'
    out = os.path.join(CLONE, rel)
    if os.path.exists(out): sys.exit('album folder already exists: ' + out)
    os.makedirs(os.path.join(out, 'thumbs'))
    with open(os.path.join(out, 'mapping.txt'), 'w') as mp:
        for i, f in enumerate(files, 1):
            im = ImageOps.exif_transpose(Image.open(os.path.join(a.source, f))).convert('RGB')
            for size, q, d in ((1800, 82, out), (600, 78, os.path.join(out, 'thumbs'))):
                c = im.copy(); c.thumbnail((size, size), Image.LANCZOS)
                c.save(os.path.join(d, f'{i:02d}.jpg'), 'JPEG', quality=q, progressive=True, optimize=True)  # no exif passed = stripped
            mp.write(f'{i:02d}.jpg\t{f}\n')
            print(f'{i:02d}.jpg  <-  {f}')
    n = len(files)
    base = PAGES + rel + '/'
    if not a.no_push:
        g = ['git', '-C', CLONE, '-c', 'user.name=rabbi-cmd', '-c', 'user.email=rabbi-cmd@users.noreply.github.com']
        subprocess.run(g + ['add', rel], check=True)
        subprocess.run(g + ['commit', '-qm', f'Add {a.title} ({a.date})'], check=True)
        subprocess.run(g + ['push', '-q'], check=True)
        for _ in range(60):
            try:
                ok = all(urllib.request.urlopen(u, timeout=15).status == 200 for u in (base + f'{n:02d}.jpg', base + f'thumbs/{n:02d}.jpg'))
                if ok: print('Pages is serving', base); break
            except Exception: pass
            time.sleep(10)
        else:
            print('WARNING: Pages not serving yet after 10 min')
    print('\nEmbed snippet:\n')
    print(f'<div class="cc-gallery" data-base="{base}" data-count="{n}" data-title="{a.title}" data-date="{a.date}"></div>')
    print(f'<script src="{PAGES}gallery.js?v=1"></script>')

if __name__ == '__main__':
    main()
