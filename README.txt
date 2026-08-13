ANA & ARISH — LOVE STORY SITE
==============================

Flat-file GitHub Pages build.

Root files:
  index.html
  style.css
  script.js
  may11.jpg
  june3.jpg
  july19.jpg
  our-song.mp3

The page starts the relationship counter at:
  May 10, 2025 (IST, +05:30)

ADDING A MEMORY
---------------
Edit MEMORY_DATA near the top of script.js and add one object with:
  id, date, chapter, title, location, image, imageAlt, shortDate, text

The timeline and gallery are generated from the same data automatically.

ADDING A SONG
-------------
Edit PLAYLIST near the top of script.js and add another object with:
  id, title, artist, src, note

Place the new audio file beside index.html. The playlist, next/previous controls,
durations, keyboard controls, and Media Session metadata will update automatically.

DEFAULT MUSIC FILE
------------------
The included first playlist entry expects:
  our-song.mp3

The browser never autoplay music on page load. Playback starts from a user action.

LOCAL MUSIC BUTTON
------------------
The "Choose a song from this device" control plays a local file in the current
browser session. It is not uploaded anywhere by this website.

KEYBOARD CONTROLS
-----------------
Space  Play / pause
Left / Right  Seek 5 seconds
Up / Down  Volume
M  Mute / unmute
[ / ]  Previous / next track
?  Show music shortcuts
Escape  Close the active dialog

DEPLOYMENT
----------
Put every file directly into the GitHub Pages repository root. There are no
subfolders required by this build.
