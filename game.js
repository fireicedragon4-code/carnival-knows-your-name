(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const SAVE_KEY = "carnival-pc-demo-save-v3";
  const AUTO_KEY = "carnival-pc-demo-autosave-v3";
  const SETTINGS_KEY = "carnival-pc-demo-settings-v3";
  const ENDINGS_KEY = "carnival-pc-demo-endings-v1";

  const itemInfo = {
    invitation: ["✦", "Personalized Invitation", "Your chosen name is written over older ink. The name beneath it is SOLSTICE."],
    ticket: ["🎟", "Torn Returning Ticket", "Milo Hart — RETURNING COMPANION. The date is tomorrow and sixteen years ago."],
    mirror: ["◇", "Warm Mirror Shard", "A second handprint appears beside yours whenever you stop looking directly at it."],
    photo: ["▧", "Wrong Cast Photograph", "Fourteen performers. The official program insists there have always been thirteen."],
    ribbon: ["⌁", "Performer Ribbon", "FOR THE ONE WHO RETURNED. Pippa remembers tying it around Milo’s wrist in a dream."],
    bell: ["♢", "Silent Silver Bell", "It rings only through the intercom—and only when you look away from yourself."],
    program: ["☾", "Misprinted Program", "The starring role of Solstice has been scratched out, but your measurements remain in the costume notes."],
    musicbox: ["♫", "Unwound Music Box", "It plays the same three notes as the unplugged radio in your bedroom."],
    thread: ["⌇", "Porcelain Mask Thread", "Warm, freshly cut, and the exact color of Milo’s jacket lining."],
    note: ["✉", "Impossible Note", "MILO REMEMBERS ME. DO NOT LET THEM TEACH HIM TO FORGET."],
    castcard: ["▤", "Fourteenth Cast Card", "The official cast ends at thirteen. This card is numbered fourteen and bears the initial A."],
    masktag: ["◉", "Rejected Mask Tag", "SUBJECT: SOLSTICE. RESULT: IDENTITY REFUSED. COMPANION ACCEPTED INSTEAD."],
    nameplate: ["⌑", "Broken Nameplate", "Only three letters survived the scraping: A R I."],
  };

  const settingsDef = {
    reducedHorror: ["Reduced horror", "Softens distortion and disturbing descriptions."],
    reduceFlashes: ["Flashing-light reduction", "Disables rapid flicker and hard visual glitches."],
    reduceSounds: ["Sudden-sound reduction", "Disables sharp stings and louder cues."],
    petNames: ["Disable pet names", "Uses neutral forms of address."],
    intense: ["Disable intense romance", "Removes optional high-intensity branches."],
    possessive: ["Disable possessive themes", "Softens optional possessive-romance choices."],
    restraint: ["Disable restraint themes", "Rewrites restraint imagery."],
    biting: ["Disable biting themes", "Removes biting references."],
  };

  const defaultSettings = {
    textSpeed: 20,
    autoDelay: 2600,
    volume: 0.22,
    musicVolume: 0.7,
    effectsVolume: 0.8,
    ambienceVolume: 0.6,
    horrorVolume: 0.65,
    reducedHorror: false,
    reduceFlashes: false,
    reduceSounds: false,
    petNames: false,
    intense: false,
    possessive: false,
    restraint: false,
    biting: false,
    helpSeen: false,
  };

  const defaultPlayer = {
    gender: "male",
    first: "Elias",
    last: "Crowe",
    romance: "both",
    skin: "#a95f43",
    hair: "#4b2c28",
    eyes: "#b77a4f",
    hairStyle: "soft",
  };

  const HAIR_STYLES = ["soft", "short", "long"];
  const SKIN_COLORS = ["#f1cfb9", "#d59a73", "#a95f43", "#69402f"];
  const HAIR_COLORS = ["#201921", "#4b2c28", "#8f3443", "#d3ad70", "#d8d3d1"];
  const EYE_COLORS = ["#6fc9dd", "#7ec08a", "#b77a4f", "#8b5bc4", "#5a352b"];
  const HAIR_LABELS = { soft: "Soft layers", short: "Short and neat", long: "Long layers" };

  const protagonistAssets = {
    male: {
      soft: ["assets/protagonist-male.png", "Male protagonist with soft layered hair"],
      short: ["assets/characters/protagonists/male-short.png", "Male protagonist with short neat hair"],
      long: ["assets/characters/protagonists/male-long.png", "Male protagonist with long layered hair"],
      label: "Male base design",
    },
    female: {
      soft: ["assets/protagonist-female.png", "Female protagonist with soft layered hair"],
      short: ["assets/characters/protagonists/female-short.png", "Female protagonist with short neat hair"],
      long: ["assets/characters/protagonists/female-long.png", "Female protagonist with long layered hair"],
      label: "Female base design",
    },
  };

  // Per-painting landmarks keep recoloring inside the illustrated features.
  // Values are normalized so the same compositor works at every display size.
  const protagonistLandmarks = {
    "assets/protagonist-male.png": {
      hair: [[.32,.018],[.48,.006],[.63,.035],[.66,.105],[.59,.155],[.51,.135],[.43,.155],[.34,.13]],
      eyes: [[.445,.083,.010,.005],[.535,.077,.010,.005]], mask: [.490,.080,.265,-.055],
    },
    "assets/characters/protagonists/male-short.png": {
      hair: [[.35,.018],[.49,.008],[.64,.032],[.65,.105],[.58,.123],[.51,.096],[.44,.125],[.36,.105]],
      eyes: [[.477,.081,.010,.005],[.565,.077,.010,.005]], mask: [.521,.079,.255,-.04],
    },
    "assets/characters/protagonists/male-long.png": {
      hair: [[.33,.016],[.49,.004],[.65,.025],[.68,.15],[.62,.205],[.55,.185],[.48,.145],[.40,.19],[.33,.15]],
      eyes: [[.490,.079,.010,.005],[.574,.074,.010,.005]], mask: [.532,.076,.255,-.035],
    },
    "assets/protagonist-female.png": {
      hair: [[.29,.025],[.46,.012],[.64,.03],[.69,.125],[.64,.19],[.58,.205],[.52,.16],[.44,.19],[.35,.18],[.29,.13]],
      eyes: [[.426,.106,.010,.005],[.512,.099,.010,.005]], mask: [.469,.102,.27,-.045],
    },
    "assets/characters/protagonists/female-short.png": {
      hair: [[.32,.025],[.48,.012],[.64,.035],[.66,.12],[.60,.15],[.53,.135],[.46,.115],[.39,.145],[.33,.11]],
      eyes: [[.450,.104,.010,.005],[.536,.098,.010,.005]], mask: [.493,.101,.265,-.035],
    },
    "assets/characters/protagonists/female-long.png": {
      hair: [[.27,.025],[.46,.01],[.66,.03],[.72,.16],[.70,.28],[.63,.315],[.57,.225],[.50,.17],[.43,.235],[.34,.30],[.28,.21]],
      eyes: [[.449,.108,.010,.005],[.535,.101,.010,.005]], mask: [.492,.104,.27,-.035],
    },
  };
  const transformationMaskAsset = "assets/protagonist-solstice-mask.png";

  const protagonistImageCache = new Map();
  let avatarRenderToken = 0;

  function safeColor(value, palette, fallback) {
    const normalized = String(value || "").toLowerCase();
    return palette.includes(normalized) ? normalized : fallback;
  }

  function sanitizePlayer(candidate = {}) {
    const next = { ...defaultPlayer, ...candidate };
    next.gender = next.gender === "female" ? "female" : "male";
    next.hairStyle = HAIR_STYLES.includes(next.hairStyle) ? next.hairStyle : "soft";
    next.skin = safeColor(next.skin, SKIN_COLORS, defaultPlayer.skin);
    next.hair = safeColor(next.hair, HAIR_COLORS, defaultPlayer.hair);
    next.eyes = safeColor(next.eyes, EYE_COLORS, defaultPlayer.eyes);
    next.romance = ["boys", "girls", "both"].includes(next.romance) ? next.romance : "both";
    return next;
  }

  function hexRgb(hex) {
    const value = String(hex).replace("#", "");
    return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)];
  }

  function sourceForPlayer(design, style) {
    const assets = protagonistAssets[design] || protagonistAssets.male;
    return (assets[style] || assets.soft)[0];
  }

  function loadProtagonistImage(src) {
    if (protagonistImageCache.has(src)) return protagonistImageCache.get(src);
    const promise = new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
    protagonistImageCache.set(src, promise);
    return promise;
  }

  function tintPixel(data, index, target, strength = 1) {
    const luminance = (data[index] * .28 + data[index + 1] * .58 + data[index + 2] * .14) / 128;
    for (let channel = 0; channel < 3; channel++) {
      const shaded = Math.max(0, Math.min(255, target[channel] * (.42 + luminance * .58)));
      data[index + channel] = data[index + channel] * (1 - strength) + shaded * strength;
    }
  }

  function pointInPolygon(x, y, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i], [xj, yj] = polygon[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / ((yj - yi) || .000001) + xi) inside = !inside;
    }
    return inside;
  }

  function recolorProtagonist(ctx, width, height, source, colors) {
    const frame = ctx.getImageData(0, 0, width, height);
    const data = frame.data;
    const skin = hexRgb(colors.skin), hair = hexRgb(colors.hair);
    const landmarks = protagonistLandmarks[source] || protagonistLandmarks["assets/protagonist-male.png"];
    for (let y = 0; y < height; y++) {
      const ny = y / height;
      for (let x = 0; x < width; x++) {
        const nx = x / width;
        const i = (y * width + x) * 4;
        if (data[i + 3] < 12) continue;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const saturation = max - min;
        const head = nx > .25 && nx < .75 && ny < .31;
        const hands = ny > .43 && ny < .71 && (nx < .39 || nx > .61);
        const skinLike = (head || hands) && r > g * 1.05 && g > b * .98 && r > 38 && saturation > 10;
        const hairZone = pointInPolygon(nx, ny, landmarks.hair);
        const hairLike = hairZone && r > g * 1.03 && r > b * 1.06 && max < 155 && saturation > 9;
        if (hairLike) tintPixel(data, i, hair, .92);
        else if (skinLike) tintPixel(data, i, skin, .88);
      }
    }
    ctx.putImageData(frame, 0, 0);
  }

  function drawIrisColor(ctx, width, height, source, color) {
    const landmarks = protagonistLandmarks[source] || protagonistLandmarks["assets/protagonist-male.png"];
    ctx.save();
    ctx.globalCompositeOperation = "color";
    ctx.fillStyle = color;
    for (const [x, y, rx, ry] of landmarks.eyes) {
      ctx.beginPath();
      ctx.ellipse(x * width, y * height, rx * width, ry * height, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawHairLayer(ctx, width, height, style, color, behind = false) {
    if (["soft", "short", "long"].includes(style)) return;
    const [r, g, b] = hexRgb(color);
    const dark = `rgb(${Math.round(r * .54)},${Math.round(g * .54)},${Math.round(b * .54)})`;
    const light = `rgb(${Math.min(255, Math.round(r * 1.28 + 18))},${Math.min(255, Math.round(g * 1.28 + 12))},${Math.min(255, Math.round(b * 1.28 + 8))})`;
    const cx = width * .5, top = height * .025, headW = width * .31, headH = height * .20;
    ctx.save();
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    if (behind) {
      ctx.fillStyle = dark;
      if (style === "ponytail") { ctx.beginPath(); ctx.ellipse(cx + headW * .82, top + headH * .72, headW * .34, headH * .92, -.18, 0, Math.PI * 2); ctx.fill(); }
      if (style === "braid") { for (let n = 0; n < 7; n++) { ctx.beginPath(); ctx.ellipse(cx + headW * .8 + Math.sin(n) * headW * .08, top + headH * (.65 + n * .27), headW * .15, headH * .22, n % 2 ? .35 : -.35, 0, Math.PI * 2); ctx.fill(); } }
      if (["wavy", "curly", "bob"].includes(style)) { ctx.beginPath(); ctx.ellipse(cx, top + headH * .72, headW * .78, headH * (style === "bob" ? .9 : 1.3), 0, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore(); return;
    }
    ctx.fillStyle = color; ctx.strokeStyle = dark; ctx.lineWidth = Math.max(3, width * .008);
    if (style === "messy" || style === "undercut") {
      ctx.beginPath(); ctx.moveTo(cx - headW * .75, top + headH * .62); ctx.quadraticCurveTo(cx - headW * .55, top - headH * .08, cx, top); ctx.quadraticCurveTo(cx + headW * .68, top + headH * .05, cx + headW * .73, top + headH * .72); ctx.lineTo(cx + headW * .42, top + headH * .45); ctx.lineTo(cx + headW * .18, top + headH * .86); ctx.lineTo(cx - headW * .02, top + headH * .38); ctx.lineTo(cx - headW * .36, top + headH * .82); ctx.closePath(); ctx.fill(); ctx.stroke();
      if (style === "undercut") { ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(cx + headW * .54, top + headH * .62, headW * .18, headH * .48, .18, 0, Math.PI * 2); ctx.fill(); }
    } else if (style === "curly") {
      for (let row = 0; row < 4; row++) for (let col = 0; col < 7; col++) { const x = cx + (col - 3) * headW * .2 + (row % 2) * headW * .08; const y = top + row * headH * .25 + Math.abs(col - 3) * headH * .025; ctx.beginPath(); ctx.arc(x, y, headW * .18, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    } else {
      ctx.beginPath(); ctx.moveTo(cx - headW * .72, top + headH * .64); ctx.quadraticCurveTo(cx - headW * .65, top, cx, top - headH * .04); ctx.quadraticCurveTo(cx + headW * .7, top + headH * .02, cx + headW * .72, top + headH * .68); ctx.quadraticCurveTo(cx + headW * .48, top + headH * .42, cx + headW * .28, top + headH * .78); ctx.quadraticCurveTo(cx, top + headH * .37, cx - headW * .3, top + headH * .82); ctx.quadraticCurveTo(cx - headW * .48, top + headH * .45, cx - headW * .72, top + headH * .64); ctx.fill(); ctx.stroke();
    }
    ctx.strokeStyle = light; ctx.lineWidth = Math.max(2, width * .004); ctx.globalAlpha = .55;
    for (let n = -2; n <= 2; n++) { ctx.beginPath(); ctx.moveTo(cx + n * headW * .18, top + headH * .06); ctx.quadraticCurveTo(cx + n * headW * .23, top + headH * .32, cx + n * headW * .2, top + headH * .55); ctx.stroke(); }
    ctx.restore();
  }

  function drawMaskOverlay(ctx, width, height, source, maskImage) {
    const [x, y, maskWidth, angle] = (protagonistLandmarks[source] || protagonistLandmarks["assets/protagonist-male.png"]).mask;
    const aspect = (maskImage.naturalHeight || maskImage.height) / (maskImage.naturalWidth || maskImage.width);
    const drawWidth = width * maskWidth, drawHeight = drawWidth * aspect;
    ctx.save();
    ctx.translate(x * width, y * height);
    ctx.rotate(angle);
    ctx.drawImage(maskImage, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  }

  async function paintProtagonist(canvas, customPlayer = player, masked = false) {
    if (!canvas?.getContext) return null;
    const styled = sanitizePlayer(customPlayer);
    const sourceStyle = ["soft", "short", "long"].includes(styled.hairStyle) ? styled.hairStyle : "soft";
    const source = sourceForPlayer(styled.gender, sourceStyle);
    const image = await loadProtagonistImage(source);
    const width = image.naturalWidth || image.width || 900, height = image.naturalHeight || image.height || 1800;
    canvas.width = width; canvas.height = height;
    canvas.style.background = `url("${source}") center bottom / contain no-repeat`;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      canvas.dataset.fallbackSource = source;
      return canvas;
    }
    ctx.clearRect(0, 0, width, height);
    drawHairLayer(ctx, width, height, styled.hairStyle, styled.hair, true);
    ctx.drawImage(image, 0, 0, width, height);
    try {
      recolorProtagonist(ctx, width, height, source, styled);
    } catch (error) {
      console.warn("Protagonist recoloring is unavailable; using the illustrated fallback.", error);
    }
    drawIrisColor(ctx, width, height, source, styled.eyes);
    drawHairLayer(ctx, width, height, styled.hairStyle, styled.hair, false);
    if (masked) drawMaskOverlay(ctx, width, height, source, await loadProtagonistImage(transformationMaskAsset));
    canvas.style.background = "none";
    delete canvas.dataset.fallbackSource;
    canvas.setAttribute("aria-label", `${styled.gender === "female" ? "Female" : "Male"} protagonist with ${HAIR_LABELS[styled.hairStyle]} hair`);
    return canvas;
  }

  async function protagonistDataURL(masked = false) {
    if (!document.createElement) return null;
    const canvas = document.createElement("canvas");
    const rendered = await paintProtagonist(canvas, player, masked);
    const fallback = rendered?.dataset?.fallbackSource || sourceForPlayer(player.gender, ["soft", "short", "long"].includes(player.hairStyle) ? player.hairStyle : "soft");
    try {
      const url = canvas.toDataURL?.("image/png");
      return url && url !== "data:," ? url : fallback;
    } catch (error) {
      console.warn("Protagonist export is unavailable; using the illustrated fallback.", error);
      return fallback;
    }
  }

  const romanceRouteNotes = {
    boys: "Lucien romance choices are enabled. Seren remains part of the mystery without opening her romance route.",
    girls: "Seren romance choices are enabled. Lucien remains part of the mystery without opening his romance route.",
    both: "Lucien and Seren romance choices are enabled.",
  };

  const freshState = () => ({
    scene: "invite",
    line: 0,
    choiceMode: false,
    endingMode: false,
    items: ["invitation"],
    flags: {},
    stats: { kind: 1, bold: 0, suspicious: 1, playful: 0, flirtatious: 0, cold: 0 },
    bonds: { milo: 2, lucien: 0, seren: 0 },
    prefs: { protection: 0, danger: 0, touch: 0, teasing: 0 },
    fear: 4,
    history: [],
    seen: {},
    playSeconds: 0,
    exploreIndex: 0,
    side: { index: 0, examined: [] },
    route: "uncommitted",
    endings: [],
  });

  let settings = { ...defaultSettings, ...readJSON(SETTINGS_KEY, {}) };
  let player = { ...defaultPlayer };
  let state = freshState();
  let typeTimer = null;
  let autoTimer = null;
  let toastTimer = null;
  let typingDone = true;
  let fullLineText = "";
  let autoMode = false;
  let currentScreen = "title";

  const L = (speaker, text, options = {}) => ({ speaker, text, ...options });
  const C = (text, sub, next, effects = {}, options = {}) => ({ text, sub, next, effects, ...options });

  const scenes = {
    invite: {
      chapter: "Prologue · An Invitation",
      location: "Your bedroom · 6:42 PM",
      bg: "bedroom",
      fear: 6,
      lines: [
        L("", "The envelope is waiting on your windowsill, though the window is locked from the inside."),
        L("", "Ivory paper. Black wax. A tiny gold mask pressed into the seal."),
        L("{name}", "I definitely did not leave that there."),
        L("", "Your chosen name curves across the front in ink the color of dried roses."),
        L("", "Beneath it, almost erased, is another name: SOLSTICE."),
        L("???", "...{pet}..."),
        L("", "The whisper comes from the unplugged radio beside your bed."),
        L("", "A card slips free: ONE NIGHT ONLY — THE CARNIVAL OF VEILS."),
        L("", "Two admissions. Sunset. Formal masks optional. Memories required."),
        L("{name}", "That last part is a joke. It has to be."),
        L("", "On the back, someone has drawn two stick figures holding hands beneath a striped tent."),
        L("", "One figure has your face. The other has been rubbed away until the paper is thin."),
        L("", "Your phone lights up with Milo’s name before you can call him."),
      ],
      choices: [
        C("Tell Milo everything immediately", "Trust him with every strange detail.", "milo", { kind: 2, milo: 2 }),
        C("Inspect the erased name first", "Something is hiding beneath your name.", "inspect", { suspicious: 2 }),
        C("Send Milo a joking photo", "Make it funny before it can scare you.", "milo", { playful: 2, milo: 1 }),
      ],
    },
    inspect: {
      chapter: "Prologue · An Invitation",
      location: "Your bedroom · 6:44 PM",
      bg: "bedroom",
      fear: 10,
      glitchAt: [2, 6],
      lines: [
        L("", "You tilt the invitation beneath the lamp."),
        L("", "For one breath, SOLSTICE appears in handwriting identical to yours."),
        L("Voice of the Midway", "That is not for you yet."),
        L("{name}", "Who said that?"),
        L("", "Your unplugged radio answers with three calliope notes."),
        L("", "The sound is cheerful in the way a smile painted on a locked door is cheerful."),
        L("Voice of the Midway", "Please avoid reading ahead. It spoils the reunion."),
        L("", "Then Milo calls—the normal world demanding to be let back in."),
      ],
      next: "milo",
    },
    milo: {
      chapter: "Prologue · An Invitation",
      location: "Your bedroom · 6:46 PM",
      bg: "bedroom",
      focus: "milo",
      fear: 7,
      lines: [
        L("Milo", "Before you say anything: yes, I got one too."),
        L("{name}", "An invitation?"),
        L("Milo", "An extremely tasteful threat disguised as an invitation."),
        L("Milo", "Mine says I’m your ‘plus one.’ Rude. I have main-character cheekbones."),
        L("{name}", "Mine was inside a locked room."),
        L("Milo", "Okay. That is less charming."),
        L("", "His joke thins, but it does not disappear. Milo never lets silence hold you alone."),
        L("Milo", "Does yours have the weird sun mask sketched inside the flap?"),
        L("{name}", "I didn’t tell you about that."),
        L("Milo", "No. You didn’t."),
        L("", "For a moment he looks past the camera, as if someone has entered the room behind him.", { focus: "milo:terrified" }),
        L("Milo", "I’ve seen it in dreams. Since we were kids, I think.", { focus: "milo:terrified" }),
        L("Milo", "I’m grabbing my jacket. We look, we laugh, and we leave the second it gets weird.", { focus: "milo:protective" }),
        L("{name}", "It started weird."),
        L("Milo", "Then we’re ahead of schedule."),
      ],
      next: "road",
    },
    road: {
      chapter: "Act I · The Road with No Turns",
      location: "County road · 7:18 PM",
      bg: "road",
      focus: "milo",
      fear: 14,
      lines: [
        L("", "Milo arrives in eight minutes, mustard jacket and worried smile included."),
        L("Milo", "Ground rules: stay together, drink nothing glowing, never split up to investigate a noise.", { focus: "milo:protective" }),
        L("{name}", "You split up to investigate noises constantly."),
        L("Milo", "Growth is admitting your flaws before repeating them."),
        L("", "The carnival should be fifteen minutes outside town. The road stretches for forty."),
        L("", "No intersections. No other cars. Painted arrows appear one by one in the headlights."),
        L("Milo", "I passed that dead oak three times."),
        L("{name}", "It had two branches the first time."),
        L("Milo", "Great. The tree is editing itself."),
        L("", "The radio changes stations without being touched."),
        L("Voice of the Midway", "Tonight’s forecast calls for clear skies, poor judgment, and a ninety-nine percent chance of reunion."),
        L("Milo", "That is not a station."),
        L("Voice of the Midway", "Milo Hart, keep both hands on the wheel. Our honored guest has waited long enough."),
        L("", "Milo’s knuckles whiten.", { focus: "milo:terrified" }),
        L("Milo", "It knows my full name.", { focus: "milo:terrified" }),
        L("Voice of the Midway", "Of course we do. You signed the guest book twice."),
        L("Milo", "I have never been here."),
        L("", "The carnival lights rise beyond the next hill before the road gives either of you permission to turn around."),
      ],
      choices: [
        C("Reassure Milo", "‘We can still turn around together.’", "gate", { kind: 2, milo: 2, protection: 1 }),
        C("Challenge the announcer", "‘Who are you—and what did he sign?’", "gate", { bold: 2, suspicious: 1 }),
        C("Quietly record the broadcast", "Evidence first. Panic later.", "gate", { suspicious: 2, cold: 1 }),
      ],
    },
    gate: {
      chapter: "Act II · The Carnival of Veils",
      location: "Carnival entrance · 7:31 PM",
      bg: "gate",
      focus: "liora",
      fear: 19,
      lines: [
        L("", "The road opens beneath a sky painted violet and gold."),
        L("", "Lanterns bloom along a midway that did not exist yesterday."),
        L("", "Music rolls over the parking field. Sweet, bright, perfectly timed."),
        L("Milo", "Visually? The curse has range."),
        L("Ticket Master", "Welcome to the Carnival of Veils. I am Liora Quill.", { focus: "liora:welcoming" }),
        L("Ticket Master", "Invitation, please.", { focus: "liora:welcoming" }),
        L("", "Her ivory half-mask bears a closed golden eye. Her gaze rests on you like someone recognizing an old photograph."),
        L("Milo", "Two guests. We leave together."),
        L("Ticket Master", "Naturally."),
        L("", "For half a second, her expression goes completely empty.", { focus: "liora:cold" }),
        L("Ticket Master", "The carnival never separates what belongs together.", { focus: "liora:cold" }),
        L("{name}", "That was not what he said."),
        L("Ticket Master", "Wasn’t it?"),
        L("", "She punches the invitation. The brass tool makes no sound."),
        L("", "A closed-eye mark bleeds through the paper and appears on your wrist."),
        L("Milo", "Take that off them."),
        L("Ticket Master", "Admission marks fade at sunrise. Usually."),
        L("Voice of the Midway", "Admission confirmed. Our missing star has returned to the stage."),
        L("", "Every nearby performer stops moving."),
        L("Voice of the Midway", "Correction: honored guest. Please disregard that."),
      ],
      next: "midway",
    },
    midway: {
      chapter: "Act II · The Carnival of Veils",
      location: "Moonlit Midway · 7:42 PM",
      bg: "gate",
      focus: "milo",
      fear: 23,
      lines: [
        L("", "The carnival is painfully alive—music, spun sugar, acrobats, beautiful masks."),
        L("", "Children chase paper moths between the stalls. Their parents never quite look at you."),
        L("Pippa", "Milo!", { focus: "pippa:performing" }),
        L("", "A blue-and-gold acrobat waves from the rigging.", { focus: "pippa:performing" }),
        L("Milo", "Do I know you?"),
        L("Pippa", "Not this time.", { focus: "pippa:frightened" }),
        L("", "Her smile vanishes before she flips away.", { focus: "pippa:frightened" }),
        L("Milo", "I officially dislike the phrase ‘this time.’"),
        L("Rowan", "Candied pear? On the house.", { focus: "rowan" }),
        L("", "A copper-haired jester offers two skewers. His bell mask has no mouth.", { focus: "rowan" }),
        L("Rowan", "You always liked them.", { focus: "rowan" }),
        L("{name}", "We have never met."),
        L("Rowan", "Right. Sorry. Opening-night nerves.", { focus: "rowan:guilty" }),
        L("Voice of the Midway", "Recognizing the honored guest is not the same as speaking to them."),
        L("", "Rowan goes pale beneath the mask.", { focus: "rowan:guilty" }),
        L("Milo", "You know what I hate? Everyone acts like we’re late."),
        L("{name}", "Do you recognize this place?"),
        L("Milo", "Only from dreams."),
        L("Milo", "The normal kind where a faceless jester begs me not to wake up."),
        L("", "He laughs, but his attention catches on the Grand Masquerade Theater."),
        L("Milo", "I know the door under that stage."),
        L("", "Fireworks bloom. You look up for one second."),
        L("", "When you look back, Milo is gone."),
      ],
      next: "vanish",
    },
    vanish: {
      chapter: "Act III · One Guest Missing",
      location: "Moonlit Midway · 7:49 PM",
      bg: "gate",
      fear: 35,
      glitchAt: [5, 10, 13],
      lines: [
        L("{name}", "Milo?"),
        L("", "His half-eaten candied pear lies on the ground. The sugar is still warm."),
        L("{name}", "Milo!"),
        L("Pippa", "What friend?", { focus: "pippa:frightened" }),
        L("{name}", "You said his name five minutes ago."),
        L("Pippa", "I don’t know anyone named Milo.", { focus: "pippa:frightened" }),
        L("", "The ribbon on her wrist is mustard yellow."),
        L("{name}", "Then why are you crying?"),
        L("", "Pippa touches her face, surprised by the tears.", { focus: "pippa:frightened" }),
        L("Pippa", "I don’t know.", { focus: "pippa:frightened" }),
        L("Voice of the Midway", "Lost parties should remain calm. Panic makes the paths rearrange."),
        L("{name}", "Where is he?"),
        L("Voice of the Midway", "Who?"),
        L("", "Milo’s name vanishes from your recent calls."),
        L("", "A knife strikes the post beside your head with a bright metallic note."),
      ],
      next: "lucien",
    },
    lucien: {
      chapter: "Act III · One Guest Missing",
      location: "Moonlit Midway · 7:51 PM",
      bg: "gate",
      focus: "lucien",
      fear: 39,
      lines: [
        L("Lucien", "Lucien Marrow. Knife artist, professional distraction, occasional terrible influence."),
        L("", "His porcelain half-mask smiles. The visible half smiles wider."),
        L("{name}", "Where is Milo?"),
        L("Lucien", "Straight to the point. You used to make me work much harder for your attention."),
        L("{name}", "I do not know you."),
        L("Lucien", "That expression is crueler than the knife.", { focus: "lucien:jealous" }),
        L("", "He plucks the blade from the post and checks your reflection in its edge."),
        L("Lucien", "No costume. No mask. Still arriving late enough to ruin me."),
        L("{name}", "If you know me, prove it."),
        L("Lucien", "You hate applause when you cannot see the audience. You count exits. You lie with your shoulders before your mouth."),
        L("", "His gaze drops to the admission mark on your wrist."),
        L("Lucien", "And you should not let Liora stamp ownership into your skin.", { focus: "lucien:jealous" }),
        L("", "He stops just outside your reach."),
        L("Lucien", "May I? Your pulse is trying to escape."),
        L("", "His hand remains open, waiting rather than touching."),
      ],
      choices: [
        C("Offer your wrist", "Allow brief contact while watching the knife.", "seren", { lucien: 2, touch: 2, flirtatious: 1 }, { romance: "boys" }),
        C("Step back", "‘No. Answer me.’", "seren", { suspicious: 2, bold: 1 }),
        C("Smile: ‘You first.’", "Turn his dangerous little game back on him.", "seren", { playful: 2, lucien: 1, teasing: 2, flirtatious: 1 }, { romance: "boys", intense: true }),
      ],
    },
    seren: {
      chapter: "Act III · One Guest Missing",
      location: "Moonlit Midway · 7:54 PM",
      bg: "gate",
      focus: ["lucien", "seren"],
      fear: 41,
      lines: [
        L("Seren", "No."),
        L("", "A red-panda woman stands beneath the lantern arch, striped tail curled around one ankle."),
        L("Lucien", "Velvet. Still appearing where you were not invited."),
        L("Seren", "Seren, to our guest."),
        L("Lucien", "They are not your guest."),
        L("Seren", "They are not your anything."),
        L("", "Her calm smile looks almost kind. The crowd has quietly moved away from her."),
        L("Seren", "You are overwhelmed. May I stand closer?"),
        L("", "She offers space—shelter shaped like a person."),
        L("{name}", "Do you know where Milo went?"),
        L("Seren", "Yes."),
        L("Lucien", "She knows where everyone goes. Sometimes before they do."),
        L("Seren", "Milo was taken toward the theater. The front doors will refuse you."),
        L("{name}", "Then help me open them."),
        L("Seren", "I intend to. Whether he likes it or not.", { focus: ["lucien", "seren:controlling"] }),
        L("", "Lucien’s smile tightens. Seren’s never changes.", { focus: ["lucien:jealous", "seren:controlling"] }),
      ],
      choices: [
        C("Let Seren come closer", "Accept her protection—for now.", "search", { seren: 2, protection: 2, touch: 1 }, { romance: "girls" }),
        C("Keep both at a distance", "Demand honest answers from both of them.", "search", { suspicious: 2, cold: 1 }),
        C("Ask which of them is more jealous", "Tease two dangerous strangers and study the result.", "search", { playful: 2, lucien: 1, seren: 1, teasing: 2, flirtatious: 1 }, { romance: "both", exactRomance: true, intense: true }),
      ],
    },
    search: {
      chapter: "Act IV · The Search",
      location: "Moonlit Midway · 8:01 PM",
      bg: "gate",
      focus: ["lucien", "seren"],
      fear: 43,
      lines: [
        L("Seren", "The theater will not open until the carnival believes you belong."),
        L("Lucien", "Collect proof. Break rules. Make friends. Whichever comes naturally."),
        L("{name}", "And you will let me wander off?"),
        L("Lucien", "I never said I would not follow."),
        L("Seren", "Nor did I."),
        L("{name}", "That was not comforting."),
        L("Voice of the Midway", "The east midway is now open for our honored guest."),
        L("Voice of the Midway", "All other guests are asked to remain inside the story assigned to them."),
        L("", "A map unfolds from the back of your invitation."),
        L("", "Five locations pulse like heartbeats. The theater sits in the center, waiting."),
      ],
      next: "EXPLORE",
    },
    ticket: {
      chapter: "Act IV · The Search",
      location: "Ticket Pavilion · 8:07 PM",
      bg: "gate",
      focus: "liora",
      item: "ticket",
      flag: "ticket",
      fear: 50,
      lines: [
        L("", "Thousands of ticket stubs hang from threads like pale leaves."),
        L("Ticket Master", "You are walking against the flow.", { focus: "liora:cold" }),
        L("{name}", "Milo is missing."),
        L("Ticket Master", "Your admission lists one guest."),
        L("{name}", "You spoke to him."),
        L("Ticket Master", "Did I?"),
        L("", "You reach across the ledger before she can close it."),
        L("", "MILO HART — RETURNING COMPANION. STATUS: TEMPORARILY UNREMEMBERED."),
        L("{name}", "What does returning mean?"),
        L("Ticket Master", "Some people are safest when no one remembers to look for them.", { focus: "liora:cold" }),
        L("{name}", "That is not an answer."),
        L("Ticket Master", "It is the answer that kept him alive last time."),
      ],
      next: "EXPLORE",
    },
    mirror: {
      chapter: "Act IV · The Search",
      location: "Hall of Borrowed Faces · 8:10 PM",
      bg: "mirror",
      item: "mirror",
      extra: "photo",
      flag: "mirror",
      fear: 61,
      glitchAt: [2, 5, 9],
      lines: [
        L("", "The mirrors show a version of the carnival with no visitors."),
        L("", "Your reflection is half a second late."),
        L("???", "He can still hear me.", { focus: "forgotten:mirror" }),
        L("{name}", "Milo?"),
        L("", "Words fog the glass from the other side."),
        L("???", "Please do not let them fix that.", { focus: "forgotten:mirror" }),
        L("", "Your reflection turns toward someone standing behind you. The real hallway is empty."),
        L("???", "He promised to remember my face.", { focus: "forgotten:gentle" }),
        L("", "A warm shard appears in your palm although no mirror breaks."),
        L("", "Behind the frame: fourteen performers. One face is scratched into a hole."),
        L("???", "Tell Milo I kept my promise.", { focus: "forgotten:gentle" }),
        L("", "The scratched-out figure takes your reflection’s hand.", { focus: "forgotten:unstable" }),
      ],
      next: "EXPLORE",
    },
    games: {
      chapter: "Act IV · The Search",
      location: "Game Alley · 8:13 PM",
      bg: "gate",
      focus: "pippa",
      item: "ribbon",
      flag: "games",
      fear: 54,
      lines: [
        L("Pippa", "Three throws. Knock down the king and win a secret.", { focus: "pippa:performing" }),
        L("{name}", "I do not have time for games."),
        L("Pippa", "Games are how time gets permission to move."),
        L("", "The smallest painted target wears Milo’s expression."),
        L("{name}", "You remember him now."),
        L("Pippa", "No. I remember the hole where someone should be.", { focus: "pippa:frightened" }),
        L("", "You knock down the king with the first throw. The booth lights all turn red."),
        L("Pippa", "That is exactly how you did it before."),
        L("{name}", "Before what?"),
        L("Pippa", "Before I forgot why I was afraid of you.", { focus: "pippa:distorted" }),
        L("", "She presses a crimson ribbon into your hand."),
        L("Pippa", "This was around Milo’s wrist in my dream. Follow it only if it points uphill."),
      ],
      next: "EXPLORE",
    },
    garden: {
      chapter: "Act IV · The Search",
      location: "Lantern Garden · 8:16 PM",
      bg: "garden",
      focus: "seren",
      item: "musicbox",
      flag: "garden",
      fear: 58,
      lines: [
        L("Seren", "You came alone."),
        L("{name}", "You followed me."),
        L("Seren", "Yes."),
        L("", "She makes no attempt to soften the admission."),
        L("Seren", "Milo is being hidden by someone who loves him badly."),
        L("{name}", "That sounds judgmental coming from you."),
        L("Seren", "Fair."),
        L("", "She lifts an unwound music box from beneath a lantern."),
        L("Seren", "You gave this to me the night I helped you escape."),
        L("{name}", "I have never seen it."),
        L("Seren", "Your hands remember. Turn the key."),
        L("", "Your fingers find the hidden catch without hesitation."),
        L("", "Three familiar notes play. Every lantern turns toward the theater."),
        L("", "A rose-haired fennec jester steps out from behind a lantern that was too narrow to hide anyone.", { focus: "coralie" }),
        L("Coralie", "That melody opens paths. It also teaches them your footsteps.", { focus: "coralie" }),
        L("Seren", "Coralie. You were told to stay out of this.", { focus: ["seren", "coralie"] }),
        L("Coralie", "I was told to smile. We are both disappointing employees.", { focus: "coralie:unmasked" }),
        L("", "For one blink, Coralie's mask is back and every lantern contains a different version of her face.", { focus: "coralie:horror" }),
        L("Coralie", "When the lights disagree, follow the one that casts your shadow—not the one that knows your name.", { focus: "coralie" }),
      ],
      next: "EXPLORE",
    },
    east: {
      chapter: "Act IV · The Search",
      location: "East Midway · 8:20 PM",
      bg: "gate",
      focus: "lucien",
      item: "bell",
      flag: "east",
      fear: 64,
      lines: [
        L("", "Rides turn with empty seats. Games applaud themselves."),
        L("Lucien", "You found my favorite bad idea."),
        L("{name}", "You said you could take me to Milo."),
        L("Lucien", "The direct path is through my dressing room."),
        L("{name}", "Convenient."),
        L("Lucien", "Suspiciously so."),
        L("", "He tosses you a silent silver bell."),
        L("Lucien", "Ring it if you lose sight of yourself—not me, yourself."),
        L("{name}", "What happens if I lose sight of you?"),
        L("Lucien", "I find you. I have always been excellent at that."),
        L("Lucien", "Come to a private rehearsal and I will show you the door beneath the stage."),
        L("", "A red dressing-room door appears behind him where the midway had been empty."),
      ],
      choices: [
        C("Decline the private room", "Keep searching where the carnival can see you.", "EXPLORE", { suspicious: 2 }),
        C("Follow Lucien now", "Trust the dangerous shortcut. This can end badly.", "bad", { lucien: 2, danger: 2, flirtatious: 1 }, { romance: "boys", danger: true }),
        C("Order him to meet you at the theater", "Keep control of the plan.", "EXPLORE", { bold: 2, lucien: 1 }),
      ],
    },
    archive: {
      chapter: "Act IV · The Search",
      location: "Abandoned Program Booth · 8:23 PM",
      bg: "gate",
      item: "program",
      flag: "archive",
      fear: 68,
      lines: [
        L("", "The abandoned booth is hidden behind a poster that insists it is a painted wall."),
        L("", "Inside, old programs are stacked by year. Every year uses the same cast photograph."),
        L("", "A single brass bell sounds behind you, though its clapper never moves.", { focus: "dorian" }),
        L("Dorian", "Please do not bend the programs. They remember every crease.", { focus: "dorian" }),
        L("{name}", "Who are you?"),
        L("Dorian", "Dorian Bellweather. Timekeeper, bell-ringer, and reluctant editor of impossible biographies.", { focus: "dorian" }),
        L("{name}", "That is impossible."),
        L("Voice of the Midway", "Consistency is the soul of a long-running production."),
        L("Dorian", "Consistency is what the carnival calls a lie it has repeated long enough.", { focus: "dorian:unmasked" }),
        L("", "One program lists a starring role scratched out so violently the page has torn."),
        L("", "SOLSTICE — Keeper of the Final Bow."),
        L("", "Dorian's bell rings backward. His reflection is suddenly several seconds late.", { focus: "dorian:horror" }),
        L("Dorian", "Do not let it finish counting you.", { focus: "dorian:horror" }),
        L("", "The costume notes contain your exact measurements."),
        L("Voice of the Midway", "Wardrobe has been very patient."),
        L("Dorian", "I can show you which role was stolen. I cannot promise the page will let you keep the answer.", { focus: "dorian:unmasked" }),
        L("", "A second line appears in fresh ink: SUBSTITUTE REQUIRED IF ORIGINAL REFUSES TO REMEMBER."),
      ],
      next: "EXPLORE",
    },
    bad: {
      chapter: "Bad Ending",
      location: "Lucien’s dressing room · Time unknown",
      bg: "dressing",
      focus: "lucien",
      fear: 88,
      glitchAt: [2, 5, 9, 13],
      lines: [
        L("", "The red door locks without touching the frame."),
        L("Lucien", "One rehearsal. Then Milo."),
        L("", "The mirror shows you in a costume you have never worn."),
        L("Voice of the Midway", "Places, everyone. Solstice has returned."),
        L("{name}", "Stop."),
        L("", "Lucien steps away immediately—but your reflection steps closer.", { focus: "lucien:horror" }),
        L("Lucien", "That is not me.", { focus: "lucien:horror" }),
        L("", "For the first time, he looks afraid.", { focus: "lucien:horror" }),
        L("???", "You left before my final bow."),
        L("", "Black thread spills from the reflection’s mouth."),
        L("Lucien", "Do not say its name."),
        L("{name}", "I do not know its name."),
        L("???", "Exactly."),
        L("", "The mirror opens like a mouth, and the audience applauds."),
        L("Voice of the Midway", "One guest recovered. One friend unaccounted for. A successful evening."),
      ],
      ending: "bad",
    },
    theater: {
      chapter: "Act V · The Empty Place",
      location: "Grand Masquerade Theater · 8:31 PM",
      bg: "theater",
      focus: "milo:masked",
      fear: 82,
      item: "thread",
      extra: "note",
      glitchAt: [3, 9, 16, 23, 28],
      lines: [
        L("", "The ticket, mirror shard, and ribbon grow warm together."),
        L("", "The theater doors inhale."),
        L("Voice of the Midway", "Our honored guest has collected enough evidence to make a regrettable decision."),
        L("", "The auditorium is filled with empty masks."),
        L("", "Hundreds of them turn as you walk down the aisle."),
        L("", "Onstage, a lone chair rotates beneath a spotlight."),
        L("", "Milo sits in it, a blank porcelain mask tied over his face."),
        L("{name}", "Milo!"),
        L("Milo", "Do not come closer."),
        L("{name}", "Who did this?"),
        L("Milo", "I do not know his name. I think that is what is killing him."),
        L("", "A pale, torn silhouette appears behind his chair.", { focus: ["milo:masked", "forgotten:gentle"] }),
        L("???", "He remembered me.", { focus: ["milo:masked", "forgotten:gentle"] }),
        L("???", "I only needed one person to remember.", { focus: ["milo:masked", "forgotten:unstable"] }),
        L("Milo", "I dreamed about him for years. Every time I woke up, there was less of his face."),
        L("", "The figure’s fingers tighten around the back of Milo’s chair.", { focus: ["milo:masked", "forgotten:unstable"] }),
        L("Seren", "Step away from him.", { focus: ["milo:masked", "seren:controlling"] }),
        L("Lucien", "Do not threaten it. Forgotten things have nothing left to lose.", { focus: ["milo:masked", "lucien:horror"] }),
        L("{name}", "Did either of you do this?"),
        L("Seren", "No."),
        L("Lucien", "Not this version of it."),
        L("", "In the mirror shard, the stage holds one extra figure: you in a sun-shaped mask."),
        L("Milo", "You were here too."),
        L("{name}", "I don’t remember."),
        L("Milo", "I think that was the deal. You forgot the carnival, and it forgot him."),
        L("Voice of the Midway", "Cast correction. The role of Solstice will once again be played by—"),
        L("", "The intercom says your chosen name, then the name beneath it."),
        L("Voice of the Midway", "Welcome home, Solstice.", { focus: "voice:silhouette" }),
        L("", "Every mask in the audience turns toward you."),
        L("", "Milo tears one hand free and throws an impossible note from the stage."),
        L("???", "Please. Before they make him forget again."),
        L("", "Beneath the note, a trapdoor opens into a tunnel full of whispering faces."),
        L("Liora", "The house is seated. The replacement is ready. We can finally finish.", { focus: "liora:intercom" }),
        L("", "The lights go out."),
      ],
      next: "backstageEntry",
    },
    backstageEntry: {
      chapter: "Act VI · Beneath the Theater",
      location: "Backstage trapdoor · 8:39 PM",
      bg: "backstage",
      focus: ["milo:masked", "rowan:unmasked"],
      fear: 84,
      lines: [
        L("", "Emergency lamps bloom beneath the stage, staining the ropes and velvet a bruised red."),
        L("", "Milo drops through the trapdoor first. You catch his wrist before the mask can pull him backward."),
        L("Milo", () => state.bonds.milo >= 5 ? "You came. I knew you would remember me." : "You came. I was starting to think the carnival had edited me out of you too."),
        L("", "The porcelain over his face is warm and breathing."),
        L("Rowan", "Do not cut the ribbon yet.", { focus: "rowan:unmasked" }),
        L("", "Rowan steps from behind a costume rack without his smiling bell mask."),
        L("Rowan", "Every mask down here is tied to a name. Break the wrong knot and the carnival keeps the person but changes who they are."),
        L("{name}", "Then take us to someone who knows the right knot."),
        L("Rowan", "Mara Vellum. Mask painter. Reluctant keeper of everyone we pretend never existed."),
        L("Voice of the Midway", "Backstage access is restricted to cast, crew, and returning mistakes.", { focus: "voice:glitch" }),
        L("Rowan", "It knows the passage is open. You have minutes, not hours."),
        L("", "Behind the scenery lies a long service corridor marked with erased names and six pools of lantern light."),
        L("Milo", "Stay where I can see you."),
        L("{name}", "That was our first rule."),
        L("Milo", "We were terrible at it."),
        L("", "Together, you enter the passage beneath the theater."),
      ],
      next: "BACKSTAGE_WALK",
    },
    walkPoster: {
      chapter: "Act VI · Beneath the Theater",
      location: "Backstage passage · Erased poster",
      bg: "corridor",
      item: "castcard",
      flag: "backstagePoster",
      fear: 85,
      focus: "forgotten:mirror",
      lines: [
        L("", "A velvet poster lists thirteen performers beneath fourteen painted silhouettes."),
        L("", "The final silhouette has been covered with fresh black paint. The paint is still wet."),
        L("???", "They kept the shape because removing me left a hole in the wall."),
        L("", "Behind the frame you find cast card fourteen. The portrait is gone, but the initial A remains."),
        L("Milo", "A. I used to say a name beginning with A in my sleep."),
        L("Voice of the Midway", "There has never been a fourteenth performer.", { focus: "voice:glitch" }),
        L("{name}", "Then it should not be afraid of a piece of paper."),
      ],
      next: "BACKSTAGE_WALK",
    },
    walkMasks: {
      chapter: "Act VI · Beneath the Theater",
      location: "Backstage passage · Rejected masks",
      bg: "corridor",
      item: "masktag",
      flag: "backstageMasks",
      fear: 87,
      focus: "milo:masked",
      lines: [
        L("", "Discarded masks hang from butcher hooks, each tagged with a name crossed out and replaced."),
        L("", "One tag reads SOLSTICE. Beneath it: IDENTITY REFUSED. COMPANION ACCEPTED INSTEAD."),
        L("Milo", "That is why it took me."),
        L("{name}", "Because I refused before."),
        L("Milo", "Or because I agreed to take your place. I cannot remember which possibility scares me more."),
        L("", "The blank mask on Milo turns toward you although his head does not move."),
      ],
      next: "BACKSTAGE_WALK",
    },
    walkMirror: {
      chapter: "Act VI · Beneath the Theater",
      location: "Backstage passage · Tarnished mirror",
      bg: "memory",
      item: "nameplate",
      flag: "backstageMirror",
      fear: 90,
      focus: ["forgotten:gentle", "milo:terrified"],
      glitchAt: [1, 4],
      lines: [
        L("", "The mirror shows the corridor as it looked sixteen years ago."),
        L("", "A younger Milo stands beside a sun-masked figure wearing your posture."),
        L("", "Between you is a gentle jester whose nameplate has been scraped almost clean."),
        L("???", "You called me Ari. I do not know if it was my whole name."),
        L("Milo", "Ari.", { focus: "milo:terrified" }),
        L("", "The mirror convulses. Every reflected light goes out except the one around the forgotten jester."),
        L("???", "That is enough to hurt. It is also enough to begin."),
      ],
      next: "BACKSTAGE_WALK",
    },
    walkMara: {
      chapter: "Act VI · Beneath the Theater",
      location: "Backstage passage · Workshop door",
      bg: "workshop",
      flag: "spokeMara",
      fear: 86,
      focus: "mara",
      lines: [
        L("", "A woman in a painted half-mask blocks an ivory door with both hands stained in gold leaf."),
        L("Mara", "You took your time, Solstice."),
        L("{name}", "That is not my name."),
        L("Mara", () => state.stats.suspicious >= 4 ? "Good. Keep questioning anyone who tells you who you are." : "Perhaps. Names are promises here, not facts."),
        L("Mara", "I am Mara Vellum. I paint faces the carnival cannot force people to wear."),
        L("Milo", "Can you remove mine?"),
        L("Mara", "Yes. The expensive question is what the mask removes with itself."),
        L("Mara", "Bring me what the corridor remembers. Then I will decide whether helping you is rescue or repetition."),
      ],
      next: "BACKSTAGE_WALK",
    },
    walkCompanion: {
      chapter: "Act VI · Beneath the Theater",
      location: "Backstage passage · Severed stage rope",
      bg: "backstage",
      flag: "spokeCompanion",
      fear: 88,
      focus: ["lucien:unmasked", "seren:controlling"],
      lines: [
        L("", "Lucien and Seren wait beneath a severed stage rope, keeping a careful distance from one another."),
        L("Lucien", () => state.bonds.lucien >= state.bonds.seren ? "I found the exit. Naturally, it hates me." : "Velvet found the safer path. I found the honest one."),
        L("Seren", () => state.bonds.seren > state.bonds.lucien ? "I can keep the carnival away from you. I cannot promise I will want to let you go afterward." : "Lucien is mistaking danger for honesty again."),
        L("{name}", "Which of you is actually helping?"),
        L("Lucien", () => player.romance === "girls" ? "Her, apparently. I can be useful without making this romantic." : "Whichever one you trusted before the lights went out."),
        L("Seren", () => player.romance === "boys" ? "Him, if that is your choice. I will still protect the corridor." : "Choose with your eyes open. Protection can become another kind of cage."),
        L("", () => companionName() + " falls into step beside you. The other remains behind to hold the theater door."),
      ],
      next: "BACKSTAGE_WALK",
    },
    maskWorkshop: {
      chapter: "Act VI · Beneath the Theater",
      location: "Mara Vellum’s mask workshop · 8:52 PM",
      bg: "workshop",
      focus: "mara:unmasked",
      fear: 89,
      lines: [
        L("", "The workshop is beautiful enough to make the danger feel impolite."),
        L("", "Ivory faces dry beside gold-leaf suns. Every unfinished mask whispers a different first name."),
        L("", "Mara removes her half-mask. Fine black cracks branch from one eye like old ink."),
        L("Mara", () => maraWillHelp() ? "You listened before forcing the door. That matters down here." : "You arrived with evidence, but evidence is not the same as mercy."),
        L("", "She turns Milo’s head toward the lantern light without touching the porcelain."),
        L("Mara", "This is a replacement mask. It cannot create a performer until someone agrees which identity should be sacrificed."),
        L("Milo", "No one is agreeing to that."),
        L("Mara", "Someone already did. Sixteen years ago."),
        L("{name}", "Me?"),
        L("Mara", "You offered the carnival your memories. Milo offered it his place. The forgotten one interrupted the exchange."),
        L("Mara", "That contradiction is why all three of you are still unfinished."),
      ],
      choices: [
        C("Lay every clue on Mara’s table", "Trust her with the evidence and ask for the truth.", "workshopTrust", { kind: 1, suspicious: 1, flags: { maraCooperates: true } }),
        C("Demand that she remove Milo’s mask", "Put Milo’s safety before Mara’s caution.", "workshopDemand", { bold: 2, protection: 1 }),
        C("Hide the broken nameplate", "Keep Ari’s surviving name away from another mask-maker.", "workshopSecret", { suspicious: 2, flags: { protectedAri: true } }),
      ],
    },
    workshopTrust: {
      chapter: "Act VI · Beneath the Theater",
      location: "Mara’s workshop · The ledger",
      bg: "workshop",
      focus: "mara:horror",
      fear: 92,
      lines: [
        L("", "Mara arranges your evidence into a circle. The masks on the walls begin breathing together."),
        L("Mara", "Ticket. Reflection. Ribbon. Program. A name damaged but not destroyed."),
        L("Mara", "The carnival can rewrite a record. It cannot survive two people remembering the same contradiction."),
        L("", "She opens a hidden ledger. Page fourteen has been sewn shut with black thread."),
        L("Mara", "The forgotten performer was Ari Vey. Milo remembered him. You helped him escape the first erasure."),
        L("Voice of the Midway", "Mara Vellum is relieved of speaking privileges.", { focus: "voice:glitch" }),
        L("", "Every mask screams without making a sound."),
        L("Mara", "Good. Now we know it is listening."),
      ],
      next: "forgottenCorridor",
    },
    workshopDemand: {
      chapter: "Act VI · Beneath the Theater",
      location: "Mara’s workshop · A dangerous kindness",
      bg: "workshop",
      focus: ["mara", "milo:masked"],
      fear: 93,
      lines: [
        L("{name}", "Take it off him. We deal with the cost afterward."),
        L("Mara", "That is exactly the sort of kindness this place weaponizes."),
        L("", () => maraWillHelp() ? "Mara studies the clues at your belt, then nods once." : "Mara’s expression closes. She reaches for a safer cutting blade instead of the truth."),
        L("Mara", () => maraWillHelp() ? "I will loosen it. You will choose who walks away." : "I can keep him himself for a few more minutes. Nothing more."),
        L("Milo", () => state.bonds.milo >= 5 ? "I trust you. I just need you to make the choice while I can still recognize your voice." : "Do not decide who I am without me."),
        L("", "The workshop’s rear wall opens onto a corridor dressed in abandoned costumes."),
      ],
      next: "forgottenCorridor",
    },
    workshopSecret: {
      chapter: "Act VI · Beneath the Theater",
      location: "Mara’s workshop · The hidden name",
      bg: "workshop",
      focus: "mara:unmasked",
      fear: 91,
      lines: [
        L("", "You keep the broken nameplate inside your coat."),
        L("Mara", "You are hiding a name from me."),
        L("{name}", "I am protecting it from the workshop."),
        L("", "For the first time, Mara smiles without professional distance."),
        L("Mara", "Then perhaps you did learn something when you escaped."),
        L("Mara", "Keep it hidden until the corridor asks. Names spoken too early become handles."),
        L("", "She opens the rear door and gives you a spool of gold thread."),
      ],
      next: "forgottenCorridor",
    },
    forgottenCorridor: {
      chapter: "Act VII · The Forgotten Corridor",
      location: "Costume storage beneath the stage · 9:03 PM",
      bg: "forgotten",
      focus: ["forgotten:unstable", "milo:terrified"],
      fear: 95,
      glitchAt: [2, 7, 12],
      lines: [
        L("", "Costumes hang in human shapes, each labeled with a role instead of a person."),
        L("", "KNIFE. VELVET. TICKET. ACROBAT. SOLSTICE. COMPANION."),
        L("", "At the end waits a blank hook numbered FOURTEEN."),
        L("Milo", "Ari Vey.", { focus: "milo:terrified" }),
        L("", () => canRestoreForgotten() ? "The corridor exhales. A face returns to the torn silhouette one careful detail at a time." : "The silhouette reaches for the sound, but too much of the name is still missing."),
        L("Ari", "Milo remembered the promise. You remembered the way back."),
        L("{name}", "What promise?"),
        L("Ari", "That none of us would let the carnival decide which one of you was real."),
        L("", "Memory strikes like stage light: your hand in Milo’s, Ari cutting a sun mask from your face, the Voice counting down."),
        L("Ari", "You were Solstice because you guided lost performers out. The carnival turned the title into ownership."),
        L("Voice of the Midway", "Correction: Solstice abandoned the cast.", { focus: "voice:revealed" }),
        L("Ari", "You saved who you could."),
        L("", () => companionName() + " arrives behind you as the stage begins lowering like a closing jaw."),
        L("Mara", "The mask is ready to choose. This time, make it hear all of you."),
      ],
      next: "stageDecision",
    },
    stageDecision: {
      chapter: "Act VII · The Decision Beneath the Stage",
      location: "The final lift · 9:09 PM",
      bg: "understage",
      focus: ["milo:masked", "voice:revealed"],
      fear: 99,
      lines: [
        L("", "The lift stops between the workshop below and the applauding theater above."),
        L("", "Milo’s mask tightens. The broken sun mask opens in your hands."),
        L("Voice of the Midway", "One role. One name. One acceptable ending."),
        L("Milo", () => state.bonds.milo >= 5 ? "Whatever you choose, choose it with me—not for me." : "I need you to remember I am still here."),
        L("Mara", () => state.flags.maraCooperates || state.flags.protectedAri ? "There is more than one ending. The carnival simply hates alternatives." : "I can hold the masks still. I cannot make the right choice for you."),
        L("", "Every earlier promise has arrived at the same narrow moment."),
      ],
      choices: [
        C("Take Milo’s hand and run for the service exit", "Requires Milo’s trust, protective choices, and enough evidence.", "endingEscape", { flags: { finalRoute: "escape" } }, { when: canEscapeWithMilo, lockedReason: "Milo does not trust the plan enough yet.", showLocked: true }),
        C("Speak Ari Vey’s name into the cast ledger", "Secret route: restore the fourteenth performer.", "endingForgotten", { flags: { finalRoute: "forgotten" } }, { when: canRestoreForgotten, lockedReason: "The fourteenth name is still incomplete.", showLocked: true }),
        C("Put the sun mask on yourself", "Refuse to let the carnival take Milo in your place.", "endingMaskSelf", { flags: { finalRoute: "mask-self" } }, { danger: true }),
        C("Let the replacement mask finish Milo’s role", "A frightened choice with permanent consequences.", "endingMaskMilo", { flags: { finalRoute: "mask-milo" } }, { danger: true }),
      ],
    },
    endingEscape: {
      chapter: "Ending · The Road Remembers",
      location: "Service road beyond the carnival · 4:57 AM",
      bg: "escape",
      focus: "milo:protective",
      fear: 28,
      lines: [
        L("", "Mara cuts the mask ribbon while you and Milo pull in opposite directions."),
        L("", "The porcelain breaks—not like glass, but like a rule losing an argument."),
        L("Milo", "Run."),
        L("", () => companionName() + " holds the backstage gate while you race through the service tunnel."),
        L("", "The carnival calls both your names. Neither of you turns around."),
        L("", "At 4:57 AM, the county road returns beneath your feet."),
        L("Milo", "Tell me something only I would know."),
        L("{name}", "You think your cheekbones make you the main character."),
        L("Milo", "Correct. We are alive."),
        L("", "Sunrise finds the mask mark gone from your wrist."),
        L("", "In the rearview mirror, a fourteenth passenger sits quietly in the back seat."),
        L("", "When you turn, the seat is empty—but a carnival ticket is warm against the upholstery."),
      ],
      ending: "escape",
    },
    endingMaskSelf: {
      chapter: "Ending · The Sun Takes a Bow",
      location: "Grand Masquerade stage · Opening night forever",
      bg: "transformation",
      focus: ["voice:revealed", "milo:terrified"],
      fear: 100,
      glitchAt: [2, 6],
      lines: [
        L("", "You press the sun mask to your face before Milo can stop you."),
        L("", "It is warm with every memory the carnival took."),
        L("Milo", "No. You do not get to save me by disappearing."),
        L("", "Your chosen name, Solstice, and a hundred forgotten stage names overlap until none feels borrowed."),
        L("Voice of the Midway", () => "Ladies and gentlemen, welcome our returning performer: " + player.first + " “Solstice” " + player.last + ".", { focus: "voice:revealed" }),
        L("", "The audience rises. The mask teaches your body a bow you remember hating."),
        L("", "Milo is released at the edge of the stage, alive and calling a name you can still understand."),
        L("", "You lift your head. Behind the porcelain, one private memory remains untouched: the way out."),
      ],
      ending: "mask-self",
    },
    endingMaskMilo: {
      chapter: "Ending · The Faithful Companion",
      location: "Grand Masquerade stage · Final casting",
      bg: "transformation",
      focus: ["milo:masked", "liora:intercom"],
      fear: 100,
      glitchAt: [1, 5],
      lines: [
        L("", "You hesitate. The replacement mask mistakes silence for consent."),
        L("", "Gold thread seals itself beneath Milo’s jaw."),
        L("Milo", "I remember you. I remember—"),
        L("", "The sentence becomes a practiced smile."),
        L("Voice of the Midway", "Please welcome Milo Hart, the Faithful Companion to our returned Solstice.", { focus: "liora:intercom" }),
        L("", "His mustard jacket darkens into stage velvet. His posture becomes perfectly still."),
        L("Milo", "Honored guest, may I escort you to your assigned memory?"),
        L("", "He offers his hand with flawless courtesy and no recognition."),
        L("", "Somewhere behind the mask, three desperate knocks answer when you squeeze his fingers."),
      ],
      ending: "mask-milo",
    },
    endingForgotten: {
      chapter: "Secret Ending · The Fourteenth Name",
      location: "Forgotten corridor · 9:14 PM",
      bg: "memory",
      focus: ["forgotten:gentle", "milo:protective"],
      fear: 74,
      lines: [
        L("{name}", "Ari Vey."),
        L("Milo", "Ari Vey."),
        L("", "Two witnesses speak the same contradiction. The cast ledger tears itself open."),
        L("", "Ari’s photograph returns first: laughing between you and Milo beneath a paper sun."),
        L("", "Then his face. Then the silver bells sewn into his sleeves."),
        L("Ari", "You came back for me."),
        L("{name}", "You came back for us first."),
        L("", "The official cast count flickers from thirteen to fourteen."),
        L("Voice of the Midway", "Unauthorized restoration in progress.", { focus: "voice:glitch" }),
        L("Mara", "Let it count. This time we are keeping the record."),
        L("", "Milo’s mask splits along the name Ari scratched into it sixteen years ago."),
        L("", "The three of you do not escape—not yet. But for the first time, the carnival cannot pretend one of you never existed."),
        L("", "Above, an audience begins applauding for a performer whose name has returned."),
      ],
      ending: "forgotten",
    },
  };

  const spots = [
    { id: "ticket", name: "Ticket Pavilion", detail: "Admission records", x: 14, y: 48, key: "1" },
    { id: "mirror", name: "Borrowed Faces", detail: "A voice in glass", x: 35, y: 23, key: "2" },
    { id: "games", name: "Game Alley", detail: "Pippa remembers", x: 73, y: 69, key: "3" },
    { id: "garden", name: "Lantern Garden", detail: "Seren and a mirage", x: 84, y: 26, key: "4" },
    { id: "east", name: "East Midway", detail: "Lucien’s shortcut", x: 19, y: 77, key: "5" },
    { id: "archive", name: "Program Booth", detail: "Dorian guards the records", x: 61, y: 19, key: "6" },
    { id: "theater", name: "Masquerade Theater", detail: "The doors recognize you", x: 51, y: 52, key: "E", theater: true },
  ];

  const backstageStops = [
    { id: "walkPoster", name: "Erased poster", kind: "object", symbol: "▤" },
    { id: "walkMasks", name: "Rejected masks", kind: "object", symbol: "◉" },
    { id: "walkMirror", name: "Tarnished mirror", kind: "object", symbol: "◇" },
    { id: "walkMara", name: "Mara", kind: "character", symbol: "M" },
    { id: "walkCompanion", name: "Lucien & Seren", kind: "character", symbol: "✦" },
    { id: "maskWorkshop", name: "Mask workshop", kind: "door", symbol: "⌂" },
  ];

  const characterAssets = {
    milo: {
      base: ["assets/milo.png", "Milo Hart"],
      protective: ["assets/characters/milo/protective.png", "Milo Hart, protective"],
      terrified: ["assets/characters/milo/terrified-memory.png", "Milo Hart, remembering something frightening"],
      masked: ["assets/characters/milo/masked-performer.png", "Milo Hart as a masked performer"],
    },
    liora: {
      base: ["assets/liora.png", "Liora Quill, the Ticket Master"],
      welcoming: ["assets/characters/liora/welcoming.png", "Liora Quill, welcoming guests"],
      cold: ["assets/characters/liora/expression-drop.png", "Liora Quill, expression gone cold"],
      intercom: ["assets/characters/liora/intercom.png", "Liora Quill taking over the intercom"],
    },
    pippa: {
      base: ["assets/pippa.png", "Pippa Vale"],
      performing: ["assets/characters/pippa/performing.png", "Pippa Vale performing"],
      frightened: ["assets/characters/pippa/frightened.png", "Pippa Vale, frightened"],
      distorted: ["assets/characters/pippa/distorted.png", "Pippa Vale, memory distorted"],
    },
    rowan: {
      base: ["assets/characters/rowan/masked-neutral.png", "Rowan, the candied-pear jester"],
      guilty: ["assets/characters/rowan/guilty.png", "Rowan, frightened and guilty"],
      unmasked: ["assets/characters/rowan/unmasked.png", "Rowan, unmasked"],
    },
    forgotten: {
      base: ["assets/characters/forgotten-jester/gentle.png", "The forgotten former-human jester"],
      gentle: ["assets/characters/forgotten-jester/gentle.png", "The forgotten jester, reaching carefully"],
      unstable: ["assets/characters/forgotten-jester/unstable.png", "The forgotten jester, terrified of being erased again"],
      mirror: ["assets/characters/forgotten-jester/mirror.png", "The forgotten jester in a faded mirror state"],
    },
    voice: {
      base: ["assets/characters/voice-midway/silhouette.png", "The hidden Voice of the Midway"],
      silhouette: ["assets/characters/voice-midway/silhouette.png", "The hidden Voice of the Midway"],
      revealed: ["assets/characters/voice-midway/revealed.png", "The Voice of the Midway revealed"],
      glitch: ["assets/characters/voice-midway/glitch.png", "The Voice of the Midway distorted by static"],
    },
    dorian: {
      base: ["assets/characters/dorian-bellweather/masked-neutral.png", "Dorian Bellweather, masked timekeeper"],
      unmasked: ["assets/characters/dorian-bellweather/unmasked-warm.png", "Dorian Bellweather, unmasked"],
      horror: ["assets/characters/dorian-bellweather/horror.png", "Dorian Bellweather caught between seconds"],
    },
    coralie: {
      base: ["assets/characters/coralie-fenn/masked-neutral.png", "Coralie Fenn, masked lantern dancer"],
      unmasked: ["assets/characters/coralie-fenn/unmasked-warm.png", "Coralie Fenn, unmasked"],
      horror: ["assets/characters/coralie-fenn/horror.png", "Coralie Fenn surrounded by false mirages"],
    },
    mara: {
      base: ["assets/characters/mara-vellum/masked-neutral.png", "Mara Vellum, mask painter"],
      unmasked: ["assets/characters/mara-vellum/unmasked-warm.png", "Mara Vellum, unmasked"],
      horror: ["assets/characters/mara-vellum/whispering-masks.png", "Mara Vellum surrounded by whispering masks"],
    },
    lucien: {
      base: ["assets/lucien.png", "Lucien Marrow"],
      unmasked: ["assets/characters/lucien/unmasked-intense.png", "Lucien Marrow, unmasked"],
      jealous: ["assets/characters/lucien/jealous.png", "Lucien Marrow, jealous"],
      horror: ["assets/characters/lucien/horror.png", "Lucien Marrow, mask cracked"],
    },
    seren: {
      base: ["assets/seren.png", "Seren"],
      unmasked: ["assets/characters/seren/unmasked-intense.png", "Seren, unmasked"],
      controlling: ["assets/characters/seren/controlling.png", "Seren, quietly controlling"],
      creature: ["assets/characters/seren/creature.png", "Seren's hidden red-panda form"],
    },
  };

  function resolveCharacterAsset(reference) {
    const [name, variant = "base"] = String(reference).split(":");
    const entry = characterAssets[name];
    if (!entry) return null;
    if (Array.isArray(entry)) return entry;
    return entry[variant] || entry.base || null;
  }

  function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  }

  function fmt(value) {
    const resolved = typeof value === "function" ? value() : value;
    return String(resolved ?? "")
      .replaceAll("{name}", player.first || "Elias")
      .replaceAll("{pet}", settings.petNames ? "honored guest" : "little star");
  }

  function companionName() {
    const lucienAvailable = player.romance !== "girls";
    const serenAvailable = player.romance !== "boys";
    if (lucienAvailable && (!serenAvailable || state.bonds.lucien >= state.bonds.seren)) {
      state.route = "lucien";
      return "Lucien";
    }
    state.route = "seren";
    return "Seren";
  }

  function maraWillHelp() {
    return state.items.length >= 9 || state.stats.kind >= 3 || state.stats.suspicious >= 5 || Boolean(state.flags.protectedAri);
  }

  function canEscapeWithMilo() {
    const evidence = ["ticket", "mirror", "ribbon", "thread"].every((item) => state.items.includes(item));
    return evidence && state.bonds.milo >= 4 && (state.stats.kind >= 3 || state.prefs.protection >= 2);
  }

  function canRestoreForgotten() {
    const secretEvidence = ["photo", "program", "musicbox", "castcard", "nameplate"].every((item) => state.items.includes(item));
    return secretEvidence && Boolean(state.flags.backstageMirror) && (state.flags.maraCooperates || state.flags.protectedAri);
  }

  function setScreen(id) {
    currentScreen = id;
    ["title", "setup", "game"].forEach((screen) => $("#" + screen).classList.toggle("hidden", screen !== id));
    if (id !== "game") clearAutoTimer();
  }

  function applyEffects(effects = {}) {
    Object.entries(effects).forEach(([key, value]) => {
      if (key in state.stats) state.stats[key] += value;
      else if (key in state.bonds) state.bonds[key] += value;
      else if (key in state.prefs) state.prefs[key] += value;
      else if (key === "flags" && value && typeof value === "object") Object.assign(state.flags, value);
      else if (key === "items" && Array.isArray(value)) value.forEach(collect);
      else if (key === "route") state.route = String(value);
    });
  }

  function collect(item) {
    if (item && !state.items.includes(item)) {
      state.items.push(item);
      const info = itemInfo[item];
      if (info) toast(`Clue found: ${info[1]}`);
      AudioEngine.chime();
    }
  }

  function go(id, effects = {}) {
    applyEffects(effects);
    state.scene = id;
    state.line = 0;
    state.choiceMode = false;
    state.endingMode = false;
    clearAutoTimer();
    if (id === "EXPLORE") {
      state.fear = Math.max(state.fear, 45);
      renderExplore();
      autosave();
      return;
    }
    if (id === "BACKSTAGE_WALK") {
      state.fear = Math.max(state.fear, 84);
      renderBackstageWalk();
      autosave();
      return;
    }
    const scene = scenes[id];
    if (!scene) return;
    if (scene.flag) state.flags[scene.flag] = true;
    collect(scene.item);
    collect(scene.extra);
    state.fear = Math.max(state.fear, scene.fear || state.fear);
    renderScene();
    autosave();
  }

  function sceneFocus(scene) {
    const left = $("#spriteLeft");
    const right = $("#spriteRight");
    const sigil = $("#sigil");
    left.classList.add("hidden"); right.classList.add("hidden"); sigil.classList.add("hidden");
    left.removeAttribute("src"); right.removeAttribute("src");
    const focus = scene.focus ? (Array.isArray(scene.focus) ? scene.focus : [scene.focus]) : [];
    $("#characterStage").classList.toggle("single-focus", focus.length === 1);
    focus.slice(0, 2).forEach((name, index) => {
      if (name === "player" || name === "player:mask") {
        const image = index ? right : left;
        image.alt = `${player.first || "The protagonist"}${name.endsWith(":mask") ? " wearing the Solstice mask" : ""}`;
        image.classList.remove("hidden");
        protagonistDataURL(name.endsWith(":mask")).then((url) => {
          if (url) image.src = url;
        }).catch(() => { image.classList.add("hidden"); });
        return;
      }
      const data = resolveCharacterAsset(name);
      if (!data) {
        sigil.textContent = name.split(":")[0].slice(0, 1).toUpperCase();
        sigil.classList.remove("hidden");
        return;
      }
      const image = index ? right : left;
      image.src = data[0];
      image.alt = data[1];
      image.classList.remove("hidden");
      image.onerror = () => {
        const base = resolveCharacterAsset(name.split(":")[0]);
        if (base && image.getAttribute("src") !== base[0]) {
          image.src = base[0];
          image.alt = base[1];
          return;
        }
        image.classList.add("hidden");
        sigil.textContent = name.slice(0, 1).toUpperCase();
        sigil.classList.remove("hidden");
      };
    });
  }

  function renderScene() {
    const scene = scenes[state.scene];
    if (!scene) return;
    setScreen("game");
    $("#explore").classList.add("hidden");
    $("#dialogue").classList.remove("hidden");
    $("#characterStage").classList.remove("hidden");
    const game = $("#game");
    game.className = `screen game-screen ${scene.bg || "gate"}${state.fear >= 70 ? " fear-high" : ""}`;
    game.dataset.protagonist = player.gender;
    game.dataset.romance = player.romance;
    game.style.setProperty("--fear", state.fear);
    AudioEngine.setScene(scene.audio || scene.bg || "gate");
    $("#chapter").textContent = scene.chapter;
    $("#location").textContent = scene.location;
    updateHUD();
    const line = scene.lines[Math.min(state.line, scene.lines.length - 1)];
    let visualFocus = line?.focus ?? scene.focus;
    const protagonistEndings = { endingEscape: "player", endingMaskSelf: "player:mask", endingForgotten: "player" };
    if (protagonistEndings[state.scene]) {
      const list = visualFocus ? (Array.isArray(visualFocus) ? [...visualFocus] : [visualFocus]) : [];
      list.unshift(protagonistEndings[state.scene]);
      visualFocus = [...new Set(list)].slice(0, 2);
    }
    sceneFocus({ focus: visualFocus });
    $("#nameWhisper").classList.toggle("hidden", state.fear < 65 || settings.reducedHorror);
    if (scene.glitchAt?.includes(state.line)) triggerGlitch();

    if (state.choiceMode) {
      renderChoices(scene);
      return;
    }
    if (state.endingMode) {
      renderEnding(scene.ending);
      return;
    }

    if (!line) return;
    addHistory(line);
    const speaker = fmt(line.speaker);
    const text = fmt(line.text);
    $("#dialogue").innerHTML = `<button class="dialogue-box" id="advanceBox" aria-label="Advance dialogue"><span class="speaker ${speaker ? "" : "hidden"}">${escapeHTML(speaker)}</span><span class="dialogue-text ${speaker ? "" : "narration"}" id="lineText"></span><i class="advance-arrow">⌄</i></button>`;
    $("#advanceBox").addEventListener("click", advance);
    typeLine(text);
  }

  function typeLine(text) {
    clearInterval(typeTimer);
    clearAutoTimer();
    fullLineText = text;
    typingDone = settings.textSpeed === 0;
    const target = $("#lineText");
    if (!target) return;
    if (typingDone) {
      target.textContent = text;
      scheduleAuto();
      return;
    }
    target.textContent = "";
    let index = 0;
    typeTimer = setInterval(() => {
      index += 1;
      target.textContent = text.slice(0, index);
      if (index >= text.length) finishTyping();
    }, settings.textSpeed);
  }

  function finishTyping() {
    clearInterval(typeTimer);
    typeTimer = null;
    const target = $("#lineText");
    if (target) target.textContent = fullLineText;
    typingDone = true;
    scheduleAuto();
  }

  function advance() {
    if (currentScreen !== "game" || state.scene === "EXPLORE" || overlayOpen()) return;
    AudioEngine.start();
    AudioEngine.click();
    if (!typingDone) {
      finishTyping();
      return;
    }
    const scene = scenes[state.scene];
    const last = state.line >= scene.lines.length - 1;
    if (!last) {
      state.line += 1;
      state.choiceMode = false;
      renderScene();
      autosave();
    } else if (scene.choices) {
      state.choiceMode = true;
      renderScene();
    } else if (scene.next) {
      go(typeof scene.next === "function" ? scene.next() : scene.next);
    } else if (scene.ending) {
      state.endingMode = true;
      renderScene();
    }
  }

  function choiceAllowed(choice) {
    if (choice.intense && settings.intense) return false;
    if (choice.when && !choice.when()) return false;
    if (choice.exactRomance) return player.romance === choice.romance;
    if (!choice.romance || player.romance === "both") return true;
    return player.romance === choice.romance;
  }

  function renderChoices(scene) {
    typingDone = true;
    clearAutoTimer();
    const choices = scene.choices.filter(choiceAllowed);
    $("#dialogue").innerHTML = `<div class="choices"><p>What do you do?</p>${choices.map((choice, index) => `<button class="choice" data-index="${scene.choices.indexOf(choice)}"><b>${index + 1}</b><span><strong>${escapeHTML(choice.text)}</strong><small>${escapeHTML(choice.sub)}</small></span><em>${choice.danger ? "Dangerous" : "Choice"}</em></button>`).join("")}</div>`;
    $$(".choice").forEach((button) => button.addEventListener("click", () => selectChoice(Number(button.dataset.index))));
  }

  function selectChoice(index) {
    const scene = scenes[state.scene];
    const choice = scene?.choices?.[index];
    if (!choice || !choiceAllowed(choice)) return;
    AudioEngine.choice();
    state.history.push({ speaker: player.first, text: choice.text, choice: true });
    if (state.history.length > 160) state.history.shift();
    go(choice.next, choice.effects);
  }

  const endingDefinitions = {
    escape: {
      eyebrow: "Escape ending discovered",
      title: "The Road Remembers",
      summary: "You trusted Milo, carried the right evidence, and escaped together. The warm ticket in the empty back seat suggests the carnival remembers the route too.",
    },
    "mask-self": {
      eyebrow: "Mask transformation ending discovered",
      title: "The Sun Takes a Bow",
      summary: "You accepted the Solstice mask to spare Milo. The carnival gained its star, but one private memory of the exit survived.",
    },
    "mask-milo": {
      eyebrow: "Mask transformation ending discovered",
      title: "The Faithful Companion",
      summary: "Hesitation allowed the replacement mask to finish Milo’s role. His identity remains trapped behind perfect stage manners.",
    },
    forgotten: {
      eyebrow: "Secret ending discovered",
      title: "The Fourteenth Name",
      summary: "You and Milo restored Ari Vey to the record. The carnival still holds you, but it can no longer erase the fourteenth performer.",
    },
  };

  function unlockEnding(type) {
    if (!state.endings.includes(type)) state.endings.push(type);
    const unlocked = readJSON(ENDINGS_KEY, []);
    if (!unlocked.includes(type)) {
      unlocked.push(type);
      try { localStorage.setItem(ENDINGS_KEY, JSON.stringify(unlocked)); } catch { /* optional persistence */ }
    }
    updateEndingButton();
  }

  function renderFullEnding(type) {
    const definition = endingDefinitions[type];
    if (!definition) return;
    unlockEnding(type);
    const trait = topKey(state.stats);
    const bond = topKey(state.bonds);
    const route = state.route === "uncommitted" ? (state.flags.finalRoute || type) : state.route;
    const memories = ["backstagePoster", "backstageMasks", "backstageMirror"].filter((flag) => state.flags[flag]).length;
    const minutes = Math.max(1, Math.round(state.playSeconds / 60));
    const dialogue = $("#dialogue");
    dialogue.innerHTML = '<div class="ending-card ending-' + escapeHTML(type) + '"><p class="eyebrow">' + escapeHTML(definition.eyebrow) + '</p><h3>' + escapeHTML(definition.title) + '</h3><p>' + escapeHTML(definition.summary) + '</p><div class="summary"><div><span>Personality</span><strong>' + escapeHTML(trait) + '</strong></div><div><span>Strongest bond</span><strong>' + escapeHTML(bond) + '</strong></div><div><span>Route</span><strong>' + escapeHTML(route) + '</strong></div><div><span>Clues</span><strong>' + state.items.length + '/' + Object.keys(itemInfo).length + '</strong></div></div><p>' + minutes + ' minutes · ' + memories + '/3 underground memories recovered.</p><button class="btn primary" id="endingSaveBtn">Save completed run</button> <button class="btn ghost" id="endingTitleBtn">Return to title</button></div>';
    $("#endingSaveBtn").onclick = quickSave;
    $("#endingTitleBtn").onclick = () => setScreen("title");
    autosave();
  }

  function renderEnding(type) {
    clearAutoTimer();
    if (endingDefinitions[type]) {
      renderFullEnding(type);
      return;
    }
    const dialogue = $("#dialogue");
    const isBad = type === "bad";
    unlockEnding(type);
    if (isBad) {
      dialogue.innerHTML = `<div class="ending-card"><p class="eyebrow">Bad ending discovered</p><h3>The Perfect Volunteer</h3><p>You followed the shortcut before you had enough proof to recognize the trap.</p><button class="btn primary" id="retryBtn">Return to the dangerous choice</button> <button class="btn ghost" id="endingTitleBtn">Title screen</button></div>`;
      $("#retryBtn").onclick = () => go("east");
    } else {
      collect("note");
      const trait = topKey(state.stats);
      const bond = topKey(state.bonds);
      const preference = topKey(state.prefs);
      const minutes = Math.max(1, Math.round(state.playSeconds / 60));
      dialogue.innerHTML = `<div class="ending-card"><p class="eyebrow">PC demo complete</p><h3>The First Bow</h3><div class="summary"><div><span>Personality</span><strong>${escapeHTML(trait)}</strong></div><div><span>Strongest connection</span><strong>${escapeHTML(bond)}</strong></div><div><span>Romantic style</span><strong>${escapeHTML(preference)}</strong></div><div><span>Clues</span><strong>${state.items.length}/${Object.keys(itemInfo).length}</strong></div></div><p>${minutes} minutes · Your choices have been preserved for the next act.</p><button class="btn primary" id="endingSaveBtn">Save completed run</button> <button class="btn ghost" id="endingTitleBtn">Return to title</button></div>`;
      $("#endingSaveBtn").onclick = quickSave;
    }
    $("#endingTitleBtn").onclick = () => setScreen("title");
    autosave();
  }

  function topKey(object) {
    return Object.entries(object).sort((a, b) => b[1] - a[1])[0]?.[0] || "unknown";
  }

  function addHistory(line) {
    const key = `${state.scene}:${state.line}`;
    if (state.seen[key]) return;
    state.seen[key] = true;
    state.history.push({ speaker: fmt(line.speaker), text: fmt(line.text) });
    if (state.history.length > 160) state.history.shift();
  }

  function updateHUD() {
    $("#clueCount").textContent = state.items.length;
    $("#fearValue").textContent = String(Math.round(state.fear)).padStart(2, "0");
    $("#fearFill").style.width = `${Math.min(100, state.fear)}%`;
  }

  function theaterReady() {
    return ["ticket", "mirror", "ribbon"].every((item) => state.items.includes(item));
  }

  function renderExplore() {
    setScreen("game");
    const game = $("#game");
    game.className = `screen game-screen gate${state.fear >= 70 ? " fear-high" : ""}`;
    game.dataset.protagonist = player.gender;
    game.dataset.romance = player.romance;
    game.style.setProperty("--fear", state.fear);
    $("#dialogue").classList.add("hidden");
    $("#spriteLeft").classList.add("hidden");
    $("#spriteRight").classList.add("hidden");
    $("#sigil").classList.add("hidden");
    $("#nameWhisper").classList.add("hidden");
    $("#explore").classList.remove("hidden");
    $("#chapter").textContent = "Act IV · The Search";
    $("#location").textContent = "Carnival grounds · 8:01 PM";
    updateHUD();
    const ready = theaterReady();
    const explored = Object.keys(state.flags).length;
    $("#explore").innerHTML = `<div class="explore-heading"><div><p class="eyebrow">Free exploration</p><h2>Find Milo</h2></div><p>Search the midway for three pieces of proof. Optional locations reveal memories and route clues.</p></div><div class="map" id="map"><div class="route-line"></div>${spots.map((spot, index) => {
      const searched = Boolean(state.flags[spot.id]);
      const disabled = spot.theater ? !ready : searched;
      return `<button class="spot ${spot.theater ? "theater-spot" : ""} ${spot.theater && ready ? "ready" : ""} ${index === state.exploreIndex ? "selected" : ""}" data-index="${index}" style="left:${spot.x}%;top:${spot.y}%" ${disabled ? "disabled" : ""}><span class="spot-key">${spot.key}</span><strong>${searched ? "✓ " : ""}${escapeHTML(spot.name)}</strong><small>${searched ? "Searched" : spot.theater && !ready ? "Need ticket, mirror, and ribbon" : escapeHTML(spot.detail)}</small></button>`;
    }).join("")}<div class="player-pin" id="playerPin"><span>✦</span></div></div><div class="map-footer"><span><b>${explored}</b> locations searched · <b>${state.items.length}</b> clues held · Theater ${ready ? "unlocked" : "sealed"}</span><span class="map-keys"><kbd>WASD</kbd> select <kbd>E</kbd> enter <kbd>C</kbd> clues</span></div>`;
    $$(".spot").forEach((button) => {
      button.addEventListener("mouseenter", () => selectSpot(Number(button.dataset.index)));
      button.addEventListener("focus", () => selectSpot(Number(button.dataset.index)));
      button.addEventListener("click", () => enterSpot(Number(button.dataset.index)));
    });
    normalizeExploreIndex();
    updateExploreSelection();
  }

  function normalizeExploreIndex() {
    const ready = theaterReady();
    const valid = spots.map((spot, index) => ({ spot, index })).filter(({ spot }) => spot.theater ? ready : !state.flags[spot.id]);
    if (!valid.some(({ index }) => index === state.exploreIndex)) state.exploreIndex = valid[0]?.index ?? spots.length - 1;
  }

  function selectSpot(index) {
    const spot = spots[index];
    if (!spot) return;
    if ((spot.theater && !theaterReady()) || (!spot.theater && state.flags[spot.id])) return;
    state.exploreIndex = index;
    updateExploreSelection();
  }

  function updateExploreSelection() {
    $$(".spot").forEach((button) => button.classList.toggle("selected", Number(button.dataset.index) === state.exploreIndex));
    const spot = spots[state.exploreIndex];
    const pin = $("#playerPin");
    if (pin && spot) { pin.style.left = `${spot.x - 3}%`; pin.style.top = `${spot.y + 7}%`; }
  }

  function enterSpot(index = state.exploreIndex) {
    const spot = spots[index];
    if (!spot || (spot.theater && !theaterReady()) || (!spot.theater && state.flags[spot.id])) return;
    AudioEngine.choice();
    go(spot.id);
  }

  function moveExplore(delta) {
    if (state.scene !== "EXPLORE") return;
    const direction = delta >= 0 ? 1 : -1;
    let index = state.exploreIndex;
    for (let count = 0; count < spots.length; count += 1) {
      index = (index + direction + spots.length) % spots.length;
      const spot = spots[index];
      if ((spot.theater && theaterReady()) || (!spot.theater && !state.flags[spot.id])) {
        selectSpot(index);
        AudioEngine.click();
        return;
      }
    }
  }

  function backstageReady() {
    return ["backstagePoster", "backstageMasks", "backstageMirror", "spokeMara", "spokeCompanion"].every((flag) => state.flags[flag]);
  }

  function renderBackstageWalk() {
    setScreen("game");
    state.scene = "BACKSTAGE_WALK";
    state.side = { ...freshState().side, ...(state.side || {}) };
    const game = $("#game");
    game.className = "screen game-screen corridor fear-high side-walk-mode";
    game.dataset.protagonist = player.gender;
    game.dataset.romance = player.romance;
    game.style.setProperty("--fear", state.fear);
    AudioEngine.setScene("corridor");
    $("#chapter").textContent = "Act VI · Beneath the Theater";
    $("#location").textContent = "Hidden backstage passage · 8:44 PM";
    $("#dialogue").classList.add("hidden");
    $("#characterStage").classList.add("hidden");
    $("#nameWhisper").classList.add("hidden");
    $("#explore").classList.remove("hidden");
    const ready = backstageReady();
    const current = backstageStops[state.side.index] || backstageStops[0];
    const examined = new Set(state.side.examined || []);
    const stops = backstageStops.map((stop, index) => {
      const done = examined.has(stop.id) || Boolean(state.flags[stop.id.replace("walk", "backstage")]);
      const locked = stop.kind === "door" && !ready;
      return '<button class="corridor-stop ' + stop.kind + (index === state.side.index ? ' selected' : '') + (done ? ' done' : '') + '" data-index="' + index + '" style="left:' + (8 + index * 17) + '%" ' + (locked ? 'disabled' : '') + '><span>' + stop.symbol + '</span><strong>' + escapeHTML(stop.name) + '</strong><small>' + (locked ? 'Examine everything first' : done ? 'Visited' : 'Press E') + '</small></button>';
    }).join("");
    $("#explore").innerHTML = '<div class="corridor-head"><div><p class="eyebrow">Side-scrolling test section</p><h2>Backstage Passage</h2></div><p>Walk the corridor, examine three objects, speak to Mara and the others, then enter the workshop.</p></div><div class="corridor-track"><div class="corridor-ropes"></div>' + stops + '<div class="walk-player" style="left:' + (8 + state.side.index * 17) + '%"><span>✦</span></div></div><div class="corridor-footer"><strong>' + escapeHTML(current.name) + '</strong><span><kbd>A</kbd><kbd>D</kbd> walk · <kbd>E</kbd> interact · <kbd>Q</kbd> save</span></div>';
    $$(".corridor-stop").forEach((button) => {
      button.addEventListener("mouseenter", () => selectBackstageStop(Number(button.dataset.index)));
      button.addEventListener("focus", () => selectBackstageStop(Number(button.dataset.index)));
      button.addEventListener("click", () => interactBackstageStop(Number(button.dataset.index)));
    });
    updateHUD();
  }

  function selectBackstageStop(index) {
    if (!backstageStops[index]) return;
    if (state.side.index === index) return;
    state.side.index = index;
    renderBackstageWalk();
  }

  function moveBackstage(delta) {
    const next = Math.max(0, Math.min(backstageStops.length - 1, state.side.index + (delta < 0 ? -1 : 1)));
    if (next === state.side.index) return;
    state.side.index = next;
    AudioEngine.footstep();
    renderBackstageWalk();
  }

  function interactBackstageStop(index = state.side.index) {
    const stop = backstageStops[index];
    if (!stop) return;
    if (stop.kind === "door" && !backstageReady()) {
      toast("The workshop opens after you examine the passage and speak to everyone.");
      AudioEngine.sting();
      return;
    }
    if (!state.side.examined.includes(stop.id)) state.side.examined.push(stop.id);
    AudioEngine.choice();
    go(stop.id);
  }

  function makeSave() {
    return { version: 5, player: sanitizePlayer(player), state, settings, savedAt: Date.now() };
  }

  function autosave() {
    try {
      localStorage.setItem(AUTO_KEY, JSON.stringify(makeSave()));
      updateTitleButtons();
    } catch { /* local storage may be unavailable */ }
  }

  function quickSave() {
    if (currentScreen !== "game") return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(makeSave()));
      updateTitleButtons();
      toast("Quick save created");
      AudioEngine.chime();
    } catch { toast("Save could not be created"); }
  }

  function loadSave(key = SAVE_KEY) {
    const data = readJSON(key, null);
    if (!data?.state || !data?.player) { toast("No save found"); return; }
    player = sanitizePlayer(data.player);
    state = { ...freshState(), ...data.state };
    state.stats = { ...freshState().stats, ...(data.state.stats || {}) };
    state.bonds = { ...freshState().bonds, ...(data.state.bonds || {}) };
    state.prefs = { ...freshState().prefs, ...(data.state.prefs || {}) };
    state.flags = { ...(data.state.flags || {}) };
    state.side = { ...freshState().side, ...(data.state.side || {}) };
    settings = { ...defaultSettings, ...data.settings };
    if ((data.version || 3) < 4 && state.scene === "theater" && state.endingMode) {
      state.scene = "backstageEntry";
      state.line = 0;
      state.endingMode = false;
      state.choiceMode = false;
    }
    if (!scenes[state.scene] && !["EXPLORE", "BACKSTAGE_WALK"].includes(state.scene)) state.scene = "invite";
    if (state.scene === "EXPLORE") renderExplore();
    else if (state.scene === "BACKSTAGE_WALK") renderBackstageWalk();
    else renderScene();
    toast(key === SAVE_KEY ? "Quick save loaded" : "Autosave loaded");
  }

  function updateTitleButtons() {
    $("#continueBtn").classList.toggle("hidden", !localStorage.getItem(AUTO_KEY));
    $("#quickLoadTitle").classList.toggle("hidden", !localStorage.getItem(SAVE_KEY));
    updateEndingButton();
  }

  function updateEndingButton() {
    const button = $("#endingGalleryTitle");
    if (!button) return;
    button.classList.toggle("hidden", readJSON(ENDINGS_KEY, []).length === 0);
  }

  function openEndingGallery() {
    const labels = {
      bad: ["Bad ending", "The Perfect Volunteer"],
      demo: ["Legacy demo ending", "The First Bow"],
      escape: ["Escape ending", "The Road Remembers"],
      "mask-self": ["Mask transformation", "The Sun Takes a Bow"],
      "mask-milo": ["Mask transformation", "The Faithful Companion"],
      forgotten: ["Secret ending", "The Fourteenth Name"],
    };
    const unlocked = readJSON(ENDINGS_KEY, []);
    $("#endingList").innerHTML = Object.entries(labels).map(([key, value]) => {
      const found = unlocked.includes(key);
      return '<article class="ending-entry ' + (found ? '' : 'locked') + '"><span>' + (found ? '✦' : '?') + '</span><div><small>' + (found ? escapeHTML(value[0]) : 'Undiscovered') + '</small><h3>' + (found ? escapeHTML(value[1]) : 'Locked ending') + '</h3></div></article>';
    }).join("");
    $("#endings").classList.remove("hidden");
  }

  function toast(message) {
    clearTimeout(toastTimer);
    const node = $("#toast");
    node.textContent = message;
    node.classList.remove("hidden");
    toastTimer = setTimeout(() => node.classList.add("hidden"), 1800);
  }

  function triggerGlitch() {
    if (settings.reducedHorror || settings.reduceFlashes) return;
    const game = $("#game");
    game.classList.remove("glitching");
    requestAnimationFrame(() => game.classList.add("glitching"));
    setTimeout(() => game.classList.remove("glitching"), 650);
    AudioEngine.sting();
  }

  function openSettings() {
    renderSettings();
    $("#settings").classList.remove("hidden");
  }

  function renderSettings() {
    $("#textSpeed").value = settings.textSpeed;
    $("#autoDelay").value = settings.autoDelay;
    $("#volume").value = settings.volume;
    $("#musicVolume").value = settings.musicVolume;
    $("#effectsVolume").value = settings.effectsVolume;
    $("#ambienceVolume").value = settings.ambienceVolume;
    $("#horrorVolume").value = settings.horrorVolume;
    updateRangeLabels();
    $("#toggleList").innerHTML = Object.entries(settingsDef).map(([key, value]) => `<label class="toggle"><span>${escapeHTML(value[0])}<small>${escapeHTML(value[1])}</small></span><input type="checkbox" data-key="${key}" ${settings[key] ? "checked" : ""}></label>`).join("");
    $$("#toggleList input").forEach((input) => input.addEventListener("change", () => {
      settings[input.dataset.key] = input.checked;
      persistSettings();
    }));
  }

  function updateRangeLabels() {
    $("#musicVolumeLabel").textContent = Math.round(settings.musicVolume * 100) + "%";
    $("#effectsVolumeLabel").textContent = Math.round(settings.effectsVolume * 100) + "%";
    $("#ambienceVolumeLabel").textContent = Math.round(settings.ambienceVolume * 100) + "%";
    $("#horrorVolumeLabel").textContent = Math.round(settings.horrorVolume * 100) + "%";
    $("#textSpeedLabel").textContent = Number(settings.textSpeed) === 0 ? "Instant" : `${settings.textSpeed} ms`;
    $("#autoDelayLabel").textContent = `${(settings.autoDelay / 1000).toFixed(1)} sec`;
    $("#volumeLabel").textContent = `${Math.round(settings.volume * 100)}%`;
  }

  function persistSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    AudioEngine.setVolumes();
    updateRangeLabels();
  }

  function openClues() {
    $("#clueList").innerHTML = Object.entries(itemInfo).map(([key, value]) => {
      const found = state.items.includes(key);
      return `<article class="clue-card ${found ? "" : "locked"}"><div class="clue-icon">${found ? value[0] : "?"}</div><h3>${found ? escapeHTML(value[1]) : "Undiscovered"}</h3><p>${found ? escapeHTML(value[2]) : "The carnival is keeping this evidence from you."}</p></article>`;
    }).join("");
    $("#clues").classList.remove("hidden");
  }

  function openHistory() {
    const list = $("#historyList");
    list.innerHTML = state.history.length ? state.history.map((entry) => `<article class="history-entry"><b>${escapeHTML(entry.speaker || "Narration")}${entry.choice ? " · Choice" : ""}</b><p>${escapeHTML(entry.text)}</p></article>`).join("") : `<p class="history-empty">No dialogue has been recorded yet.</p>`;
    $("#history").classList.remove("hidden");
    requestAnimationFrame(() => { list.scrollTop = list.scrollHeight; });
  }

  function closeOverlay(node) {
    node.classList.add("hidden");
    persistSettings();
  }

  function overlayOpen() {
    return $$(".overlay").some((overlay) => !overlay.classList.contains("hidden"));
  }

  function closeTopOverlay() {
    const open = $$(".overlay").reverse().find((overlay) => !overlay.classList.contains("hidden"));
    if (open) { closeOverlay(open); return true; }
    return false;
  }

  function toggleAuto() {
    autoMode = !autoMode;
    $("#autoBtn").classList.toggle("on", autoMode);
    toast(autoMode ? "Auto-play on" : "Auto-play off");
    autoMode ? scheduleAuto() : clearAutoTimer();
  }

  function scheduleAuto() {
    clearAutoTimer();
    if (!autoMode || !typingDone || state.choiceMode || state.endingMode || ["EXPLORE", "BACKSTAGE_WALK"].includes(state.scene) || overlayOpen()) return;
    autoTimer = setTimeout(advance, Number(settings.autoDelay));
  }

  function clearAutoTimer() {
    clearTimeout(autoTimer);
    autoTimer = null;
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => toast("Fullscreen is unavailable here"));
    else document.exitFullscreen?.();
  }

  function updateAvatar() {
    const canvas = $("#avatarCanvas");
    const design = protagonistAssets[player.gender] || protagonistAssets.male;
    const token = ++avatarRenderToken;
    canvas?.classList.add("switching");
    paintProtagonist(canvas, player).then(() => {
      if (token === avatarRenderToken) requestAnimationFrame(() => canvas?.classList.remove("switching"));
    }).catch(() => canvas?.classList.remove("switching"));
    $("#avatarBaseLabel").textContent = `${design.label} · ${HAIR_LABELS[player.hairStyle] || HAIR_LABELS.soft}`;
    $("#avatarName").textContent = `${player.first || (player.gender === "male" ? "Elias" : "Elara")} ${player.last || "Crowe"}`;
    $$("#genderSeg button").forEach((button) => {
      const selected = button.dataset.value === player.gender;
      button.classList.toggle("on", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    $("#routeNote").textContent = romanceRouteNotes[player.romance] || romanceRouteNotes.both;
  }

  function syncCreator() {
    $("#firstName").value = player.first;
    $("#lastName").value = player.last;
    $("#romance").value = player.romance;
    $("#skin").value = player.skin;
    $("#hair").value = player.hair;
    $("#eyes").value = player.eyes;
    $("#hairStyle").value = player.hairStyle;
    updateAvatar();
  }

  function beginGame(event) {
    event?.preventDefault();
    player.first = player.first.trim() || (player.gender === "male" ? "Elias" : "Elara");
    player.last = player.last.trim() || "Crowe";
    state = freshState();
    AudioEngine.start();
    go("invite");
    if (!settings.helpSeen && matchMedia("(pointer:fine)").matches) {
      settings.helpSeen = true;
      persistSettings();
      $("#help").classList.remove("hidden");
    }
  }

  const AudioEngine = {
    context: null,
    master: null,
    ambientGain: null,
    musicGain: null,
    effectsGain: null,
    horrorGain: null,
    drone: null,
    started: false,
    start() {
      if (this.started) { this.context?.resume?.(); return; }
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        this.context = new AC();
        this.master = this.context.createGain();
        this.master.gain.value = settings.volume;
        this.master.connect(this.context.destination);
        this.musicGain = this.context.createGain();
        this.effectsGain = this.context.createGain();
        this.horrorGain = this.context.createGain();
        this.musicGain.connect(this.master);
        this.effectsGain.connect(this.master);
        this.horrorGain.connect(this.master);
        this.ambientGain = this.context.createGain();
        this.ambientGain.gain.value = .035 * settings.ambienceVolume;
        this.ambientGain.connect(this.master);
        const drone = this.context.createOscillator();
        this.drone = drone;
        const filter = this.context.createBiquadFilter();
        drone.type = "sine"; drone.frequency.value = 55; filter.type = "lowpass"; filter.frequency.value = 180;
        drone.connect(filter); filter.connect(this.ambientGain); drone.start();
        const upper = this.context.createOscillator();
        const upperGain = this.context.createGain();
        upper.type = "triangle"; upper.frequency.value = 82.41; upperGain.gain.value = .012;
        upper.connect(upperGain); upperGain.connect(this.musicGain); upper.start();
        this.setVolumes();
        this.started = true;
      } catch { /* audio is optional */ }
    },
    setVolumes() {
      if (this.master) this.master.gain.value = Number(settings.volume);
      if (this.musicGain) this.musicGain.gain.value = Number(settings.musicVolume);
      if (this.effectsGain) this.effectsGain.gain.value = Number(settings.effectsVolume);
      if (this.horrorGain) this.horrorGain.gain.value = Number(settings.horrorVolume);
      if (this.ambientGain) this.ambientGain.gain.value = .035 * Number(settings.ambienceVolume);
    },
    setScene(scene) {
      if (!this.drone || !this.context) return;
      const frequencies = { theater: 58, backstage: 51, corridor: 47, workshop: 65, forgotten: 43, understage: 39, escape: 82, transformation: 36, memory: 61 };
      const target = frequencies[scene] || 55;
      this.drone.frequency.setTargetAtTime(target, this.context.currentTime, .8);
    },
    tone(frequency = 440, duration = .08, gain = .035, type = "sine", channel = "effects") {
      if (!this.context || settings.volume <= 0) return;
      const now = this.context.currentTime;
      const oscillator = this.context.createOscillator();
      const volume = this.context.createGain();
      oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, now);
      volume.gain.setValueAtTime(gain, now); volume.gain.exponentialRampToValueAtTime(.0001, now + duration);
      const target = channel === "horror" ? this.horrorGain : channel === "music" ? this.musicGain : this.effectsGain;
      oscillator.connect(volume); volume.connect(target || this.master); oscillator.start(now); oscillator.stop(now + duration);
    },
    click() { if (!settings.reduceSounds) this.tone(260, .045, .02, "triangle"); },
    choice() { this.tone(392, .12, .04, "sine"); setTimeout(() => this.tone(523, .16, .03, "sine"), 70); },
    chime() { this.tone(523, .2, .04, "sine"); setTimeout(() => this.tone(659, .3, .035, "sine"), 110); },
    sting() { if (!settings.reduceSounds) this.tone(92, .24, .055, "sawtooth", "horror"); },
    footstep() { this.tone(118, .06, .018, "triangle", "effects"); },
    mirror() { this.tone(740, .35, .022, "sine", "horror"); },
    mask() { this.tone(184, .18, .03, "triangle", "effects"); },
  };

  function handleKey(event) {
    if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
    if (event.key === "Escape") {
      event.preventDefault();
      if (!closeTopOverlay() && currentScreen === "game") openSettings();
      return;
    }
    if (overlayOpen()) return;
    if (event.key.toLowerCase() === "f") { event.preventDefault(); toggleFullscreen(); return; }
    if (currentScreen === "title" && event.key === "Enter") { $("#newBtn").click(); return; }
    if (currentScreen !== "game") return;
    const key = event.key.toLowerCase();
    if (state.scene === "BACKSTAGE_WALK") {
      if (["a", "arrowleft"].includes(key)) { event.preventDefault(); moveBackstage(-1); }
      else if (["d", "arrowright"].includes(key)) { event.preventDefault(); moveBackstage(1); }
      else if (key === "e" || key === "enter" || key === " ") { event.preventDefault(); interactBackstageStop(); }
    } else if (state.scene === "EXPLORE") {
      if (["w", "a", "arrowup", "arrowleft"].includes(key)) { event.preventDefault(); moveExplore(-1); }
      else if (["s", "d", "arrowdown", "arrowright"].includes(key)) { event.preventDefault(); moveExplore(1); }
      else if (key === "e" || key === "enter" || key === " ") { event.preventDefault(); enterSpot(); }
      else if (/^[1-6]$/.test(key)) { const index = Number(key) - 1; selectSpot(index); enterSpot(index); }
    } else if (state.choiceMode && /^[1-4]$/.test(key)) {
      event.preventDefault();
      const allowed = scenes[state.scene].choices.filter(choiceAllowed);
      const choice = allowed[Number(key) - 1];
      if (choice) selectChoice(scenes[state.scene].choices.indexOf(choice));
    } else if (event.key === " " || event.key === "Enter") { event.preventDefault(); advance(); }
    if (key === "q") quickSave();
    else if (key === "l") loadSave();
    else if (key === "c") openClues();
    else if (key === "h") openHistory();
    else if (key === "a") toggleAuto();
    else if (key === "u") $("#game").classList.toggle("ui-hidden");
  }

  $("#newBtn").onclick = () => { syncCreator(); setScreen("setup"); };
  $("#continueBtn").onclick = () => loadSave(AUTO_KEY);
  $("#quickLoadTitle").onclick = () => loadSave(SAVE_KEY);
  $("#endingGalleryTitle").onclick = openEndingGallery;
  $("#backTitle").onclick = () => setScreen("title");
  $("#titleBtn").onclick = () => { closeTopOverlay(); setScreen("title"); };
  $("#saveBtn").onclick = quickSave;
  $("#loadBtn").onclick = () => loadSave(SAVE_KEY);
  $("#cluesBtn").onclick = openClues;
  $("#historyBtn").onclick = openHistory;
  $("#autoBtn").onclick = toggleAuto;
  $("#hideUiBtn").onclick = () => $("#game").classList.toggle("ui-hidden");
  $("#fullBtn").onclick = toggleFullscreen;
  $("#settingsFull").onclick = toggleFullscreen;
  $$(".settings-open").forEach((button) => button.onclick = openSettings);
  $$(".modal-close").forEach((button) => button.onclick = () => closeOverlay(button.closest(".overlay")));
  $$(".overlay").forEach((overlay) => overlay.addEventListener("mousedown", (event) => { if (event.target === overlay) closeOverlay(overlay); }));
  $$("#genderSeg button").forEach((button) => button.onclick = () => {
    $$("#genderSeg button").forEach((other) => other.classList.remove("on"));
    button.classList.add("on");
    const oldDefault = player.gender === "male" ? "Elias" : "Elara";
    player.gender = button.dataset.value;
    if (!player.first || player.first === oldDefault) player.first = player.gender === "male" ? "Elias" : "Elara";
    $("#firstName").value = player.first;
    updateAvatar();
  });
  $("#firstName").oninput = (event) => { player.first = event.target.value; updateAvatar(); };
  $("#lastName").oninput = (event) => { player.last = event.target.value; updateAvatar(); };
  $("#romance").onchange = (event) => { player.romance = event.target.value; updateAvatar(); };
  $("#skin").onchange = (event) => { player.skin = event.target.value; updateAvatar(); };
  $("#hair").onchange = (event) => { player.hair = event.target.value; updateAvatar(); };
  $("#eyes").onchange = (event) => { player.eyes = event.target.value; updateAvatar(); };
  $("#hairStyle").onchange = (event) => { player.hairStyle = event.target.value; updateAvatar(); };
  $("#creatorForm").onsubmit = beginGame;
  $("#textSpeed").oninput = (event) => { settings.textSpeed = Number(event.target.value); persistSettings(); };
  $("#autoDelay").oninput = (event) => { settings.autoDelay = Number(event.target.value); persistSettings(); };
  $("#volume").oninput = (event) => { settings.volume = Number(event.target.value); AudioEngine.start(); persistSettings(); };
  $("#musicVolume").oninput = (event) => { settings.musicVolume = Number(event.target.value); AudioEngine.start(); persistSettings(); };
  $("#effectsVolume").oninput = (event) => { settings.effectsVolume = Number(event.target.value); AudioEngine.start(); persistSettings(); };
  $("#ambienceVolume").oninput = (event) => { settings.ambienceVolume = Number(event.target.value); AudioEngine.start(); persistSettings(); };
  $("#horrorVolume").oninput = (event) => { settings.horrorVolume = Number(event.target.value); AudioEngine.start(); persistSettings(); };
  document.addEventListener("keydown", handleKey);
  document.addEventListener("visibilitychange", () => { if (document.hidden) clearAutoTimer(); else scheduleAuto(); });
  setInterval(() => { if (currentScreen === "game" && !document.hidden) state.playSeconds += 1; }, 1000);

  Object.values(protagonistAssets).forEach((design) => {
    [design.soft, design.short, design.long].forEach(([src]) => { const image = new Image(); image.src = src; });
  });
  updateAvatar();
  updateTitleButtons();
  const qaParams = location.hostname === "terminal.local" ? new URLSearchParams(location.search) : null;
  const qaRoute = qaParams?.get("qa");
  const qaLine = Number(qaParams?.get("line"));
  if (qaRoute === "explore") {
    player = { ...defaultPlayer, first: "Kairo" };
    state = freshState();
    state.items = ["invitation", "ticket", "mirror", "photo", "ribbon"];
    state.fear = 62;
    state.scene = "EXPLORE";
    renderExplore();
  } else if (qaRoute === "bad") {
    player = { ...defaultPlayer, first: "Kairo" };
    state = freshState();
    go("bad");
  } else if (qaRoute === "theater") {
    player = { ...defaultPlayer, first: "Kairo" };
    state = freshState();
    state.items = ["invitation", "ticket", "mirror", "photo", "ribbon", "bell", "program", "musicbox"];
    go("theater");
  } else if (qaRoute === "backstage") {
    player = { ...defaultPlayer, first: "Kairo" };
    state = freshState();
    state.items = ["invitation", "ticket", "mirror", "photo", "ribbon", "program", "musicbox", "thread", "note"];
    state.bonds.milo = 6;
    go("BACKSTAGE_WALK");
  } else if (qaRoute && qaRoute.startsWith("ending-")) {
    const endingScene = {
      "ending-escape": "endingEscape",
      "ending-mask-self": "endingMaskSelf",
      "ending-mask-milo": "endingMaskMilo",
      "ending-forgotten": "endingForgotten",
    }[qaRoute];
    if (endingScene) {
      player = { ...defaultPlayer, first: "Kairo" };
      state = freshState();
      state.items = Object.keys(itemInfo);
      state.flags = { backstagePoster: true, backstageMasks: true, backstageMirror: true, maraCooperates: true };
      state.bonds.milo = 7;
      go(endingScene);
    }
  } else if (["archive", "garden"].includes(qaRoute)) {
    player = { ...defaultPlayer, first: "Kairo" };
    state = freshState();
    go(qaRoute);
    if (Number.isInteger(qaLine) && qaLine >= 0) {
      state.line = Math.min(qaLine, scenes[qaRoute].lines.length - 1);
      renderScene();
    }
  } else if (["routes-boys", "routes-girls", "routes-both"].includes(qaRoute)) {
    player = { ...defaultPlayer, first: "Kairo", romance: qaRoute.replace("routes-", "") };
    state = freshState();
    state.scene = "seren";
    state.line = scenes.seren.lines.length - 1;
    state.choiceMode = true;
    renderScene();
  } else if (qaRoute?.startsWith("sprite-")) {
    const reference = qaRoute.slice("sprite-".length);
    player = { ...defaultPlayer, first: "Kairo" };
    state = freshState();
    state.scene = "milo";
    renderScene();
    sceneFocus({ focus: reference });
    $("#chapter").textContent = "Character Sprite QA";
    $("#location").textContent = reference;
  }
  if (location.hostname === "terminal.local") {
    window.__CARNIVAL_QA__ = {
      scenes,
      backstageStops,
      getPlayer: () => player,
      getState: () => state,
      setState(patch = {}) {
        state = { ...freshState(), ...patch };
        state.stats = { ...freshState().stats, ...(patch.stats || {}) };
        state.bonds = { ...freshState().bonds, ...(patch.bonds || {}) };
        state.prefs = { ...freshState().prefs, ...(patch.prefs || {}) };
        state.flags = { ...(patch.flags || {}) };
        state.side = { ...freshState().side, ...(patch.side || {}) };
      },
      go,
      advance,
      selectChoice,
      choiceAllowed,
      canEscapeWithMilo,
      canRestoreForgotten,
      backstageReady,
      makeSave,
      sanitizePlayer,
      HAIR_STYLES,
      SKIN_COLORS,
      HAIR_COLORS,
      EYE_COLORS,
    };
  }
  if ("serviceWorker" in navigator && location.hostname !== "terminal.local" && /^https?:$/.test(location.protocol)) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
})();
