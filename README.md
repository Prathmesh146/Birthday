# Birthday Surprise Web App

A cinematic, 60fps polished web application to celebrate two people sharing the same birthday.

## How to run
1. Open the folder `birthday/`.
2. Double-click `index.html`. It will open in your default browser (Chrome or Edge recommended).
3. The app is entirely offline. No build step required.

## Key Controls (TV friendly)
- **Space** or **Right Arrow**: Next step. On the first press, it attempts to enter fullscreen.
- **Left Arrow**: Previous step.
- **M**: Toggle music on/off (if `music.mp3` is present in the folder).

## Folder Structure
- `index.html`: Main HTML file.
- `css/`: Design tokens, base styles, and components.
- `js/`: Scripts for background canvas, slideshow, steps logic, and main app.
- `photos/`: Place your PNG photos here (`papa1.png`, `nilesh1.png`, etc.).
- `tools/`: Contains a python script to optimize images.

## Customization
All configuration lives in `js/config.js`. 
You can change names, Marathi/English wishes, photo filenames, colors, and timings by editing this file.

## Fonts
The new slide uses the **Great Vibes** font. 
1. Create a folder named `fonts/` in the `birthday/` directory.
2. Download the free "Great Vibes" font in `.woff2` format from Google Fonts or a webfont generator.
3. Name it `GreatVibes-Regular.woff2` and place it in the `fonts/` folder.
If the font is missing, the app gracefully falls back to system script fonts.

## Optimizing Photos
If your PNG photos are large, you can optimize them using the included Python script.
1. Ensure you have Python installed and the Pillow library (`pip install Pillow`).
2. Put original PNGs in the `photos/` folder.
3. Run `python tools/optimize.py` from the `birthday/` directory.
4. It will create smaller copies in `photos/optimized/`.
5. Open `js/config.js` and change `photoDir` to `'photos/optimized/'`.
