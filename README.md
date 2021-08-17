## mbsprite: Command line utilities for Mapbox sprites

This tool lets you disassemble a Mapbox spritesheet into its component pngs, and do the reverse. It supports both @1x and @2x icons.

Unlike sprite-zero, which works on SVGs, this only works on PNGs.

### `mbsprite explode`

To explode all the icons from a Mapbox sprite sheet into `icons` and `icons@2x`:

`node mbsprite explode https://api.mapbox.com/styles/v1/mapbox/light-v9/sprite?access_token=pk.eyYOURACCESSTOKEN icons`

### `mbsprite bundle`

To bundle all the icons back into a sprite sheet in `sprite/sprite.json`, `sprite/sprite.png`, `sprite/sprite@2x.json` and `sprite/sprite@2x.png`:

`node mbsprite bundle sprite icons icons@2x`

### Merging spritesheets

To merge two spritesheets together, simply explode two sprite sheets into the same directory, then bundle.

### Usage with npx

If you have [`npx`](https://www.npmjs.com/package/npx) installed, you can simply run:

`npx mbsprite <args...>`

### Using with Figma

To generate a spritesheet from icons in Figma, see the instructions in [Figmasset-export](npmjs.com/package/figmasset-export).