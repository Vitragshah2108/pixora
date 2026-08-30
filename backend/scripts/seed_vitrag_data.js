import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcryptjs';

import { User } from '../src/models/user.model.js';
import { Image } from '../src/models/image.model.js';
import { Collection } from '../src/models/collection.model.js';
import { Like } from '../src/models/like.model.js';
import { Favorite } from '../src/models/favorite.model.js';
import { Follow } from '../src/models/follow.model.js';
import { Comment } from '../src/models/comment.model.js';
import { Notification } from '../src/models/notification.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const DB_NAME = "image_sharing_platform";
const mongoURI = process.env.MONGO_URI;

const communityCreatorsData = [
  {
    username: "elena_rostova",
    email: "elena.rostova.art@pixora.io",
    fullName: "Elena Rostova",
    profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80",
    bio: "Cyberpunk Concept Artist & Sci-Fi Illustrator 🚀 | Tokyo & Berlin | Exploring neon dystopias & futuristic worldbuilding ✨",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "kai_takahashi",
    email: "kai.takahashi@pixora.io",
    fullName: "Kai Takahashi",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=80",
    bio: "Tokyo Nightscape & Rainy Street Photographer 📸 🌧️ | Leica Ambassador | Capturing neon reflections and quiet urban moments",
    badge: "trendsetter",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "sophia_vance",
    email: "sophia.vance@pixora.io",
    fullName: "Sophia Vance",
    profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1400&q=80",
    bio: "3D Artist & Visual Alchemist 💎✨ | Specializing in chromatic glass, fluid mechanics & surreal motion design | London, UK",
    badge: "trendsetter",
    userStatus: "away",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "marcus_chen",
    email: "marcus.chen@pixora.io",
    fullName: "Marcus Chen",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80",
    bio: "Architect & Minimalist Geometry Enthusiast 🏛️ | Curating brutalist lines, natural light & organic modern spaces | Singapore",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: false,
  },
  {
    username: "aria_sterling",
    email: "aria.sterling@pixora.io",
    fullName: "Aria Sterling",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80",
    bio: "Editorial & Avant-Garde Portrait Photographer 🎞️ | Exploring shadow, luminescence & surreal beauty | Paris / Milan",
    badge: "rising",
    userStatus: "busy",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "lucas_muller",
    email: "lucas.muller@pixora.io",
    fullName: "Lucas Müller",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
    bio: "Astrophotographer & Mountain Explorer 🌌🏔️ | Chasing dark skies, auroras & dramatic alpine peaks across the Alps & Patagonia",
    badge: "pro",
    userStatus: "offline",
    isVerified: true,
    isPremium: false,
  },
  {
    username: "chloe_dubois",
    email: "chloe.dubois@pixora.io",
    fullName: "Chloé Dubois",
    profilePicture: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1400&q=80",
    bio: "Generative Abstract Art & Color Theory 🎨✨ | Creating algorithmic dreams and vibrant sensory experiences",
    badge: "rising",
    userStatus: "online",
    isVerified: false,
    isPremium: false,
  },
  {
    username: "zane_quantum",
    email: "zane.quantum@pixora.io",
    fullName: "Zane Quantum",
    profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80",
    bio: "Deep Space Visualist & Retrowave Dreamer 🛸🪐 | Synthesizing retrofuturism, cosmic nebulas & digital nostalgia",
    badge: "newbie",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  }
];

const vitragImagesData = [
  {
    title: "Neon Odyssey: Shinjuku 2099",
    description: "A rain-drenched cyberpunk megacity avenue glowing under intense cyan and magenta holographic billboards, featuring sleek aerodynamic flying transports weaving between neon skyscrapers.",
    imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_vitrag_neon_odyssey",
    category: "cyberpunk",
    license: "extended",
    tags: ["cyberpunk", "neon", "tokyo", "scifi", "futuristic", "night", "cityscape"],
    imageSize: 4280,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Chroma Samurai: Midnight Protocol",
    description: "Cybernetic urban operative standing in a misty alleyway illuminated by vivid pink and deep violet neon reflections on rain-slicked pavement.",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_vitrag_chroma_samurai",
    category: "cyberpunk",
    license: "standard",
    tags: ["cyberpunk", "character", "neon", "warrior", "synthwave", "blade", "futuristic"],
    imageSize: 3820,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Synthetica Core: Android Awakening",
    description: "Futuristic artificial intelligence core with intricate optical fiber wiring, ethereal holographic interface, and glowing bioluminescent hues.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_vitrag_synthetica_core",
    category: "cyberpunk",
    license: "extended",
    tags: ["cyberpunk", "ai", "hardware", "bioluminescent", "circuits", "scifi"],
    imageSize: 4610,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Alpine Solitude: Sunrise Over Fjord",
    description: "Dramatic jagged mountain peaks kissed by the first golden rays of sunlight, casting mirror-perfect reflections across tranquil glacial waters.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_vitrag_alpine_solitude",
    category: "landscape",
    license: "standard",
    tags: ["landscape", "mountains", "sunrise", "fjord", "nature", "scenic", "wanderlust"],
    imageSize: 5120,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Aurora Symphony: Arctic Horizon",
    description: "Spectacular curtains of emerald green and violet Northern Lights dancing across the starry night sky over traditional Nordic fishermen cabins.",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_vitrag_aurora_symphony",
    category: "landscape",
    license: "extended",
    tags: ["aurora", "northernlights", "arctic", "nightsky", "landscape", "stars", "norway"],
    imageSize: 5840,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Emerald Cascade: The Hidden Falls",
    description: "Lush moss-covered basalt canyon with a roaring turquoise waterfall plunging into crystal-clear emerald pools, veiled in delicate morning mist.",
    imageUrl: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_vitrag_emerald_cascade",
    category: "landscape",
    license: "standard",
    tags: ["waterfall", "nature", "forest", "emerald", "landscape", "serene", "greenery"],
    imageSize: 4930,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Ethereal Luminescence: Dual Tone Studio",
    description: "High fashion avant-garde portrait featuring deep indigo and vibrant crimson gel lighting, capturing intricate facial features with rich cinematic contrast.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_vitrag_ethereal_luminescence",
    category: "portrait",
    license: "extended",
    tags: ["portrait", "cinematic", "lighting", "fashion", "neon", "editorial", "beauty"],
    imageSize: 3950,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Soul of the City: Golden Hour Gaze",
    description: "Emotional close-up portrait of a woman standing in warm sunset backlight, creating a halo effect around her hair with soft golden bokeh in the background.",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_vitrag_soul_of_city",
    category: "portrait",
    license: "standard",
    tags: ["portrait", "goldenhour", "bokeh", "warmth", "people", "streetphotography"],
    imageSize: 4120,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Prism Dimensions: 3D Refraction",
    description: "Surreal 3D render of twisted iridescent glass ribbon refracting rainbow spectrums against a deep velvet dark minimalist backdrop.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_vitrag_prism_dimensions",
    category: "abstract",
    license: "extended",
    tags: ["abstract", "3d", "glass", "chromatic", "iridescent", "surreal", "render"],
    imageSize: 4780,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Cosmic Marbling: Liquid Nebula",
    description: "Macro abstract photograph of swirling metallic gold, royal sapphire, and deep amethyst acrylic pigments floating in viscous liquid.",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_vitrag_cosmic_marbling",
    category: "abstract",
    license: "standard",
    tags: ["abstract", "fluidart", "macro", "liquid", "gold", "psychedelic", "colors"],
    imageSize: 5310,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Brutalist Geometry: Shadows & Angles",
    description: "Striking minimalist architectural composition showcasing raw exposed concrete angles casting stark geometric diagonal shadows against a clear cobalt sky.",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_vitrag_brutalist_geometry",
    category: "minimal",
    license: "standard",
    tags: ["minimal", "architecture", "brutalist", "shadows", "geometry", "lines", "clean"],
    imageSize: 3640,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Helix Infinity: The Symmetrical Staircase",
    description: "Mesmerizing top-down perspective of an endless spiral staircase with pristine white balustrades and deep wooden steps, radiating flawless symmetry.",
    imageUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_vitrag_helix_infinity",
    category: "minimal",
    license: "extended",
    tags: ["minimal", "staircase", "symmetry", "spiral", "architecture", "monochrome"],
    imageSize: 4890,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Starlight Voyage: Cosmos Unbound",
    description: "Astronaut floating effortlessly in the cosmic expanse of outer space, illuminated by the distant celestial glow of a multicolored spiral galaxy.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_vitrag_starlight_voyage",
    category: "other",
    license: "extended",
    tags: ["scifi", "space", "astronaut", "galaxy", "stars", "universe", "cosmos"],
    imageSize: 5670,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Vaporwave Horizon: Grid Runner",
    description: "Retro-futuristic 80s synthwave landscape with a glowing magenta wireframe grid horizon, floating geometric pyramids, and an oversized crimson sunset.",
    imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_vitrag_vaporwave_horizon",
    category: "other",
    license: "standard",
    tags: ["synthwave", "vaporwave", "retro", "grid", "80s", "sunset", "outrun"],
    imageSize: 4420,
    visibility: "public",
    commentsAllowed: true,
  }
];

const communityImagesData = [
  {
    creatorUsername: "kai_takahashi",
    title: "Rainy Shibuya Crossing at 2 AM",
    description: "Neon reflections shimmer across wet Tokyo crosswalks with lone umbrella silhouettes moving through glowing reflections.",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_kai_shibuya",
    category: "cyberpunk",
    tags: ["tokyo", "street", "rain", "neon", "night"],
    imageSize: 4100,
  },
  {
    creatorUsername: "sophia_vance",
    title: "Iridescent Liquid Sphere",
    description: "High-resolution 3D simulation of a floating chrome and glass fluid sphere distorting studio light.",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_sophia_sphere",
    category: "abstract",
    tags: ["3d", "render", "glass", "chromatic", "fluid"],
    imageSize: 4600,
  },
  {
    creatorUsername: "lucas_muller",
    title: "Milky Way Arch Over Patagonia",
    description: "Massive astrophotography panorama capturing the full galactic core arching over snow-dusted granite towers.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_lucas_milkyway",
    category: "landscape",
    tags: ["astrophotography", "stars", "patagonia", "milkyway"],
    imageSize: 5800,
  },
  {
    creatorUsername: "marcus_chen",
    title: "Shadows in Concrete",
    description: "Modernist museum facade featuring cantilevered concrete planes bathed in late afternoon sunlight.",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_marcus_shadows",
    category: "minimal",
    tags: ["minimal", "architecture", "brutalist", "light"],
    imageSize: 3700,
  },
  {
    creatorUsername: "aria_sterling",
    title: "Cyan Silhouette: Midnight Muse",
    description: "Moody silhouette profile framed by soft cyan ambient backlight and gentle atmospheric smoke.",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_aria_silhouette",
    category: "portrait",
    tags: ["portrait", "editorial", "cyan", "silhouette", "moody"],
    imageSize: 3900,
  }
];

async function seed() {
  try {
    await mongoose.connect(`${mongoURI}/${DB_NAME}`);
    console.log("🚀 Connected to MongoDB");

    // 1. Find or create Vitrag's account
    let vitrag = await User.findOne({ email: "vitragshah2108@gmail.com" });
    if (!vitrag) {
      console.log("Creating Vitrag's user profile...");
      vitrag = new User({
        username: "vitragshah",
        email: "vitragshah2108@gmail.com",
        fullName: "Vitrag Shah",
        provider: "google",
      });
    }

    // Enhance Vitrag's profile data
    vitrag.fullName = "Vitrag Shah";
    vitrag.username = vitrag.username || "vitragshah";
    vitrag.profilePicture = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80";
    vitrag.coverPicture = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=85";
    vitrag.bio = "✨ Visual Architect & Digital Creator | Exploring Cyberpunk aesthetics, Surreal 3D landscapes & Minimalist architecture | Featured Creator @ Pixora 📸";
    vitrag.badge = "trendsetter";
    vitrag.profileVisibility = "public";
    vitrag.userStatus = "online";
    vitrag.isVerified = true;
    vitrag.isPremium = true;
    vitrag.isDpConfirm = true;
    vitrag.socialLinks = {
      instagram: "https://instagram.com/vitrag.creates",
      twitter: "https://twitter.com/vitrag_art",
      facebook: "https://facebook.com/vitragshah"
    };

    await vitrag.save();
    console.log(`✅ Vitrag's profile updated: ${vitrag._id} (${vitrag.email})`);

    // 2. Create or update Community Creators
    const defaultPasswordHash = await bcrypt.hash("PixoraCreator2026!", 10);
    const creatorMap = {};

    for (const cData of communityCreatorsData) {
      let creator = await User.findOne({ email: cData.email });
      if (!creator) {
        creator = new User({
          ...cData,
          password: defaultPasswordHash,
          provider: "credentials",
          profileVisibility: "public",
        });
      } else {
        Object.assign(creator, cData);
      }
      await creator.save();
      creatorMap[cData.username] = creator;
    }
    console.log(`✅ ${communityCreatorsData.length} Community Creators ready.`);

    // 3. Clear previous demo data for clean state
    const allUserIds = [vitrag._id, ...Object.values(creatorMap).map(c => c._id)];
    await Image.deleteMany({ user: { $in: allUserIds } });
    await Collection.deleteMany({ user: { $in: allUserIds } });
    await Like.deleteMany({ user: { $in: allUserIds } });
    await Favorite.deleteMany({ user: { $in: allUserIds } });
    await Follow.deleteMany({ $or: [{ follower: { $in: allUserIds } }, { following: { $in: allUserIds } }] });
    await Comment.deleteMany({ user: { $in: allUserIds } });
    await Notification.deleteMany({ recipient: { $in: allUserIds } });
    console.log("🧹 Cleaned old demo entries for seed users.");

    // 4. Insert Vitrag's Images
    const vitragImages = [];
    let totalStorage = 0;

    for (const imgData of vitragImagesData) {
      const img = new Image({
        user: vitrag._id,
        ...imgData,
      });
      await img.save();
      vitragImages.push(img);
      totalStorage += imgData.imageSize || 4000;
    }
    console.log(`✅ Inserted ${vitragImages.length} images for Vitrag.`);

    // 5. Insert Community Images
    const communityImages = [];
    for (const cImg of communityImagesData) {
      const creator = creatorMap[cImg.creatorUsername];
      if (creator) {
        const img = new Image({
          user: creator._id,
          title: cImg.title,
          description: cImg.description,
          imageUrl: cImg.imageUrl,
          publicId: cImg.publicId,
          category: cImg.category,
          license: "standard",
          tags: cImg.tags,
          imageSize: cImg.imageSize,
          visibility: "public",
          commentsAllowed: true,
        });
        await img.save();
        communityImages.push(img);
      }
    }
    console.log(`✅ Inserted ${communityImages.length} community showcase images.`);

    // 6. Create Collections for Vitrag
    const cyberpunkImages = vitragImages.filter(img => img.category === 'cyberpunk').map(i => i._id);
    const landscapeImages = vitragImages.filter(img => img.category === 'landscape').map(i => i._id);
    const abstractImages = vitragImages.filter(img => img.category === 'abstract' || img.category === 'other').map(i => i._id);
    const minimalImages = vitragImages.filter(img => img.category === 'minimal').map(i => i._id);

    const collectionsData = [
      {
        user: vitrag._id,
        name: "⚡ Cyberpunk & Neon Visions",
        description: "Curated collection of dystopian futuristic cities, chrome warriors, and neon nocturnal atmospheres.",
        coverImage: vitragImages[0].imageUrl,
        visibility: "public",
        images: cyberpunkImages,
        tags: ["cyberpunk", "neon", "scifi", "tokyo"],
        isStarred: true,
      },
      {
        user: vitrag._id,
        name: "🏔️ Majestic Landscapes & Horizons",
        description: "Ethereal mountain peaks, arctic auroras, and pristine cascading waterfalls from around the globe.",
        coverImage: vitragImages[3].imageUrl,
        visibility: "public",
        images: landscapeImages,
        tags: ["landscape", "nature", "mountains", "aurora"],
        isStarred: true,
      },
      {
        user: vitrag._id,
        name: "💎 3D Glass & Surrealism",
        description: "Explorations into refraction, chromatic glass sculptures, and zero-gravity cosmic aesthetics.",
        coverImage: vitragImages[8].imageUrl,
        visibility: "public",
        images: abstractImages,
        tags: ["3d", "abstract", "glassmorphism", "surreal"],
        isStarred: true,
      },
      {
        user: vitrag._id,
        name: "🏛️ Minimalist Architecture",
        description: "Brutalist lines, organic shadows, clean perspective symmetry, and modern spatial design.",
        coverImage: vitragImages[10].imageUrl,
        visibility: "public",
        images: minimalImages,
        tags: ["minimal", "architecture", "geometry", "lines"],
        isStarred: false,
      },
    ];

    for (const colData of collectionsData) {
      const col = new Collection(colData);
      await col.save();
    }
    console.log(`✅ Created ${collectionsData.length} Collections for Vitrag.`);

    // 7. Create Follow Relationships
    // All 8 creators follow Vitrag
    for (const creator of Object.values(creatorMap)) {
      await Follow.create({
        follower: creator._id,
        following: vitrag._id,
      });
    }

    // Vitrag follows 5 of the top creators
    const creatorsToFollow = [
      creatorMap["elena_rostova"],
      creatorMap["kai_takahashi"],
      creatorMap["sophia_vance"],
      creatorMap["marcus_chen"],
      creatorMap["aria_sterling"],
    ];

    for (const c of creatorsToFollow) {
      await Follow.create({
        follower: vitrag._id,
        following: c._id,
      });
    }
    console.log("✅ Created mutual follower & following relationships.");

    // 8. Likes and Favorites
    const creatorsList = Object.values(creatorMap);
    let totalVitragLikesReceived = 0;

    for (let i = 0; i < vitragImages.length; i++) {
      const image = vitragImages[i];
      // Randomly assign 4 to 8 creators to like this image
      const likersCount = Math.floor(Math.random() * 4) + 4; // 4 to 7
      const shuffledCreators = [...creatorsList].sort(() => 0.5 - Math.random());
      const selectedLikers = shuffledCreators.slice(0, likersCount);

      for (const liker of selectedLikers) {
        await Like.create({
          user: liker._id,
          image: image._id,
        });
      }

      // Also assign 2 to 4 creators to favorite this image
      const favCount = Math.floor(Math.random() * 3) + 2;
      const favCreators = shuffledCreators.slice(0, favCount);
      for (const fav of favCreators) {
        await Favorite.create({
          user: fav._id,
          image: image._id,
        });
      }

      // Update image counts
      image.likesCount = likersCount;
      image.favoritesCount = favCount;
      await image.save();

      totalVitragLikesReceived += likersCount;
    }

    // Vitrag likes and favorites some community images
    for (const cImg of communityImages) {
      await Like.create({
        user: vitrag._id,
        image: cImg._id,
      });
      await Favorite.create({
        user: vitrag._id,
        image: cImg._id,
      });
      cImg.likesCount = (cImg.likesCount || 0) + 1;
      cImg.favoritesCount = (cImg.favoritesCount || 0) + 1;
      await cImg.save();
    }
    console.log(`✅ Likes and favorites populated (Total received likes: ${totalVitragLikesReceived}).`);

    // 9. Comments & Replies
    const sampleComments = [
      {
        imageIndex: 0,
        creator: creatorMap["kai_takahashi"],
        text: "The lighting and atmospheric depth on this cyberpunk street are insane! Perfect cyberpunk vibe. 🔥",
        reply: "Thanks Kai! Really tried to dial in the wet asphalt reflections just right!",
      },
      {
        imageIndex: 0,
        creator: creatorMap["elena_rostova"],
        text: "Adding this straight to my visual inspiration moodboard. Incredible work Vitrag! ✨",
      },
      {
        imageIndex: 3,
        creator: creatorMap["lucas_muller"],
        text: "That morning alpine light gradient is breathtaking. What lens/prompt settings did you use?",
        reply: "Appreciate it Lucas! Golden hour right after a light snowfall is pure magic.",
      },
      {
        imageIndex: 8,
        creator: creatorMap["sophia_vance"],
        text: "The chromatic dispersion on the glass refraction is so clean! Loving the color palette. 💎",
        reply: "Coming from you Sophia, that means a lot! Experimented with dual-index refraction here.",
      },
      {
        imageIndex: 10,
        creator: creatorMap["marcus_chen"],
        text: "Flawless brutalist contrast. Those diagonal shadow cuts give it so much architectural rhythm! 🏛️",
      },
      {
        imageIndex: 6,
        creator: creatorMap["aria_sterling"],
        text: "The dual-tone red & cyan lighting ratio is masterclass level. Stunning portrait work!",
      },
      {
        imageIndex: 4,
        creator: creatorMap["zane_quantum"],
        text: "Pure cosmic poetry. Northern lights never fail to mesmerize! 🌌✨",
      },
    ];

    for (const c of sampleComments) {
      const targetImage = vitragImages[c.imageIndex];
      const commentDoc = new Comment({
        user: c.creator._id,
        image: targetImage._id,
        text: c.text,
      });
      await commentDoc.save();
      targetImage.commentsCount = (targetImage.commentsCount || 0) + 1;

      if (c.reply) {
        const replyDoc = new Comment({
          user: vitrag._id,
          image: targetImage._id,
          text: c.reply,
          parentComment: commentDoc._id,
        });
        await replyDoc.save();
        commentDoc.repliesCount = 1;
        await commentDoc.save();
        targetImage.commentsCount += 1;
      }

      await targetImage.save();
    }
    console.log("✅ Comments and threaded replies created.");

    // 10. Notifications for Vitrag
    const notificationsData = [
      {
        recipient: vitrag._id,
        sender: creatorMap["elena_rostova"]._id,
        type: "like",
        content: "liked your image 'Neon Odyssey: Shinjuku 2099'",
        relatedImage: vitragImages[0]._id,
        read: false,
      },
      {
        recipient: vitrag._id,
        sender: creatorMap["kai_takahashi"]._id,
        type: "comment",
        content: "commented on 'Neon Odyssey: Shinjuku 2099': \"The lighting and atmospheric depth on this are insane! 🔥\"",
        relatedImage: vitragImages[0]._id,
        read: false,
      },
      {
        recipient: vitrag._id,
        sender: creatorMap["sophia_vance"]._id,
        type: "favorite",
        content: "favorited your image 'Prism Dimensions: 3D Refraction'",
        relatedImage: vitragImages[8]._id,
        read: false,
      },
      {
        recipient: vitrag._id,
        sender: creatorMap["marcus_chen"]._id,
        type: "follow",
        content: "started following you",
        relatedUser: creatorMap["marcus_chen"]._id,
        read: true,
      },
      {
        recipient: vitrag._id,
        sender: creatorMap["lucas_muller"]._id,
        type: "like",
        content: "liked your image 'Alpine Solitude: Sunrise Over Fjord'",
        relatedImage: vitragImages[3]._id,
        read: true,
      },
      {
        recipient: vitrag._id,
        sender: creatorMap["aria_sterling"]._id,
        type: "favorite",
        content: "saved your image 'Ethereal Luminescence' to their favorites",
        relatedImage: vitragImages[6]._id,
        read: true,
      },
      {
        recipient: vitrag._id,
        sender: creatorMap["chloe_dubois"]._id,
        type: "follow",
        content: "started following you",
        relatedUser: creatorMap["chloe_dubois"]._id,
        read: true,
      }
    ];

    for (const notif of notificationsData) {
      await Notification.create(notif);
    }
    console.log(`✅ Created ${notificationsData.length} notifications.`);

    // 11. Recalculate Vitrag's final user counts & points
    vitrag.postsCount = vitragImages.length;
    vitrag.followersCount = creatorsList.length; // 8
    vitrag.followingCount = creatorsToFollow.length; // 5
    vitrag.likesCount = totalVitragLikesReceived;
    vitrag.storageUsed = totalStorage;
    // Points: 1 pt per like + 2 pt per comment + 2 pt per favorite + 2 pt per follow
    vitrag.interactionsCount = (totalVitragLikesReceived * 1) + (sampleComments.length * 2) + (creatorsList.length * 2);

    await vitrag.save();
    console.log("🎉 Vitrag's user stats successfully calculated and saved!");
    console.log({
      postsCount: vitrag.postsCount,
      followersCount: vitrag.followersCount,
      followingCount: vitrag.followingCount,
      likesCount: vitrag.likesCount,
      badge: vitrag.badge,
      storageUsed: `${(vitrag.storageUsed / 1024).toFixed(2)} MB`,
    });

    await mongoose.disconnect();
    console.log("🏁 Database seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seed();
