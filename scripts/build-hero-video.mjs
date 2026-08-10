/**
 * Turn the supplied logo sting into a loopable hero background.
 *
 * `media/hero-source.mp4` is the raw render and it is not loopable as-is:
 *
 * 1. It opens on a bright title card that dissolves away over the first 13
 *    frames (average luma 64 -> 23). Because the clip is played on `loop`,
 *    that card flashes back on screen every 8 seconds, which is the grey pop
 *    at the loop point.
 * 2. The same opening frames carry a "Veo" watermark in the bottom-right
 *    corner from the tool that generated it.
 * 3. It ends holding the finished logo, so even without the card the last
 *    frame and the first frame are nowhere near each other and the cut reads
 *    as a jump.
 * 4. It ships an AAC track the page can never play — the element is muted.
 *
 * So: drop the head (which takes the watermark with it), then fade in from
 * black and out to black over a second at each end. The page background is
 * #0F0F12, so both ends resolve to the same near-black the video sits on and
 * the loop seam disappears — the logo simply forms, holds, and dissolves.
 *
 * Two encodes come out of it. Phones only ever show the clip in a band across
 * the top of the hero, so they get a 480p cut at roughly a third of the bytes;
 * everything else gets the 720p one.
 *
 *   node scripts/build-hero-video.mjs
 */
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';

const SOURCE = 'media/hero-source.mp4';

/** First frame after the title card has fully dissolved (and the watermark is gone). */
const TRIM_START_FRAME = 14;
const FPS = 24;
const SOURCE_FRAMES = 192;
/** Long enough to read as a deliberate dissolve, short enough not to eat the animation. */
const FADE_SECONDS = 1;

const OUTPUTS = [
  { file: 'public/hero-bg.mp4', width: 1280, crf: 25 },
  { file: 'public/hero-bg-mobile.mp4', width: 854, crf: 28 },
];

const duration = (SOURCE_FRAMES - TRIM_START_FRAME) / FPS;
const fadeOutStart = duration - FADE_SECONDS;

if (fadeOutStart <= FADE_SECONDS) {
  throw new Error(`Clip is only ${duration}s — the two fades would overlap.`);
}

for (const { file, width } of OUTPUTS) {
  const filters = [
    `trim=start_frame=${TRIM_START_FRAME}`,
    'setpts=PTS-STARTPTS',
    // Scale before fading so the fade runs over fewer pixels, and keep the
    // height even: yuv420p cannot encode odd dimensions.
    `scale=${width}:-2:flags=lanczos`,
    `fade=t=in:st=0:d=${FADE_SECONDS}`,
    `fade=t=out:st=${fadeOutStart.toFixed(4)}:d=${FADE_SECONDS}`,
  ].join(',');

  execFileSync(
    'ffmpeg',
    [
      '-y', '-v', 'error',
      '-i', SOURCE,
      '-vf', filters,
      // The element is muted; the audio track is dead weight.
      '-an',
      '-c:v', 'libx264',
      '-profile:v', 'high',
      '-pix_fmt', 'yuv420p',
      '-crf', String(OUTPUTS.find((o) => o.file === file).crf),
      '-preset', 'slow',
      // Two-second GOP so a loop restart never waits on a distant keyframe.
      '-g', String(FPS * 2),
      '-movflags', '+faststart',
      file,
    ],
    { stdio: 'inherit' },
  );

  const kb = Math.round(statSync(file).size / 1024);
  console.log(`${file}  ${width}px  ${duration.toFixed(2)}s  ${kb} KB`);
}
