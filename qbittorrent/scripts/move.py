#!/usr/bin/env python3
"""
Minimal script to verify qBittorrent "Run external program" executes correctly.
It logs only the content path and torrent name.
"""
import sys, shutil
from pathlib import Path
from datetime import datetime

def log(message: str):
    """Append message to a log file in the same directory as the script."""
    script_dir = Path(__file__).resolve().parent
    logfile = script_dir / "qb_external_program_test.log"

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with logfile.open("a", encoding="utf-8") as f:
        f.write(f"[{timestamp}] {message}\n")


def main():

    # Expect 2 arguments: content path (%F) + torrent name (%N)
    if len(sys.argv) < 3:
        log(f"ERROR: Not enough arguments. Got: {sys.argv}")
        log("-" * 40)
        return
    
    content_path = sys.argv[1]
    torrent_name = sys.argv[2]

    # Some variables
    qbittorrent_container_downloads_path = '/downloads/'
    qbittorrent_plex_movies_path = '/plex-movies/'
    qbittorrent_plex_series_path = '/plex-series/'

    log("-" * 40)
    log(f"Script triggered.")
    log(f"Content Path: {content_path}")
    log(f"Torrent Name: {torrent_name}")

    # Strip file from prefix path
    media_file_name = content_path.strip(qbittorrent_container_downloads_path)
    log(f'Stripped media file of prefix directory. File name: {media_file_name}')

    # Make file name lower case
    media_file_name = media_file_name.lower()

    # Strip file of backslashes brackets and spaces.
    media_file_name = media_file_name.strip('\\')
    media_file_name = media_file_name.replace('(', '').replace(')', '')
    media_file_name = media_file_name.replace(' ', '.')


    # Determine if file is movie of series
    list_of_series_indicators = ['season', 'episode']
    if any(indicator in media_file_name for indicator in list_of_series_indicators):
        media_type = 'series'
        destination_path = qbittorrent_plex_series_path
    else:
        media_type = 'movie'
        destination_path = qbittorrent_plex_movies_path

    log(f'Detected a {media_type} with name: {media_file_name}. Attempting to move file to {destination_path}{media_file_name}')

    try:
        shutil.move(content_path, f'{destination_path}{media_file_name}')
    except:
        log(f'Failed to move file to {destination_path}{media_file_name}')
    finally:
        log('Script completed.')
        log("-" * 40)

main()