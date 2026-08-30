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

// 30 Diverse Global Creators
const creatorsData = [
  // Cyberpunk & Sci-Fi
  {
    username: "elena_rostova",
    email: "elena.rostova.art@pixora.io",
    fullName: "Elena Rostova",
    profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80",
    bio: "Cyberpunk Concept Artist & Sci-Fi Illustrator 🚀 | Tokyo & Berlin | Exploring neon dystopias & futuristic worldbuilding ✨",
    badge: "trendsetter",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
    socialLinks: { instagram: "https://instagram.com/elena_concepts", twitter: "https://twitter.com/elena_rostova" }
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
    socialLinks: { instagram: "https://instagram.com/kai_nightscapes", twitter: "https://twitter.com/kai_takahashi" }
  },
  {
    username: "zane_quantum",
    email: "zane.quantum@pixora.io",
    fullName: "Zane Quantum",
    profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80",
    bio: "Deep Space Visualist & Retrowave Dreamer 🛸🪐 | Synthesizing retrofuturism, cosmic nebulas & digital nostalgia",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
    socialLinks: { twitter: "https://twitter.com/zane_quantum" }
  },
  {
    username: "nyx_shadow",
    email: "nyx.shadow@pixora.io",
    fullName: "Nyx Vesper",
    profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80",
    bio: "Hacker Aesthetic & Cybernetic Lore 🕹️ | Building digital ruins in Unreal Engine 5 | Seoul, KR",
    badge: "rising",
    userStatus: "busy",
    isVerified: true,
    isPremium: false,
  },
  {
    username: "cypher_k",
    email: "cypher.k@pixora.io",
    fullName: "Kenji Sato",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    bio: "Mecha Concept Designer & Synthwave Producer ⚡ Osaka, Japan | Blending analog synthesis with neon mecha art",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },

  // 3D Render & Abstract
  {
    username: "sophia_vance",
    email: "sophia.vance@pixora.io",
    fullName: "Sophia Vance",
    profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1400&q=80",
    bio: "3D Artist & Visual Alchemist 💎✨ | Specializing in chromatic glass, fluid mechanics & surreal motion design | London, UK",
    badge: "trendsetter",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
    socialLinks: { instagram: "https://instagram.com/sophiavance_3d" }
  },
  {
    username: "chloe_dubois",
    email: "chloe.dubois@pixora.io",
    fullName: "Chloé Dubois",
    profilePicture: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1400&q=80",
    bio: "Generative Abstract Art & Color Theory 🎨✨ | Creating algorithmic dreams and vibrant sensory experiences | Paris, FR",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "mateo_prism",
    email: "mateo.prism@pixora.io",
    fullName: "Mateo Silva",
    profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1400&q=80",
    bio: "Houdini FX & Procedural Glass Simulations 🔮 Barcelona | Transforming pure light and geometry into visual poetry",
    badge: "rising",
    userStatus: "away",
    isVerified: false,
    isPremium: false,
  },
  {
    username: "aurora_flux",
    email: "aurora.flux@pixora.io",
    fullName: "Aurora Lindholm",
    profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80",
    bio: "Kinetic Sculptor & Raytracing Virtuoso 🌌 Stockholm | Exploring zero-gravity physics and iridescent refractions",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "devon_render",
    email: "devon.render@pixora.io",
    fullName: "Devon Reed",
    profilePicture: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1400&q=80",
    bio: "Octane & Blender specialist 🖥️ | Crafting hyper-realistic abstract textures and digital ceramics | Los Angeles",
    badge: "rising",
    userStatus: "offline",
    isVerified: false,
    isPremium: true,
  },

  // Landscape & Nature & Astrophotography
  {
    username: "lucas_muller",
    email: "lucas.muller@pixora.io",
    fullName: "Lucas Müller",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
    bio: "Astrophotographer & Mountain Explorer 🌌🏔️ | Chasing dark skies, auroras & dramatic alpine peaks across the Alps & Patagonia",
    badge: "trendsetter",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
    socialLinks: { instagram: "https://instagram.com/lucas_alpine" }
  },
  {
    username: "freja_nordic",
    email: "freja.nordic@pixora.io",
    fullName: "Freja Hansen",
    profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80",
    bio: "Nordic Wilderness & Fjords Explorer ❄️ 🌲 Reykjavik & Tromsø | Documenting Arctic light and volcanic horizons",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "ethan_wild",
    email: "ethan.wild@pixora.io",
    fullName: "Ethan Wright",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1400&q=80",
    bio: "National Geographic Contributor 🌿 | Chasing misty rainforests, hidden waterfalls & ancient redwoods | PNW, USA",
    badge: "trendsetter",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "maya_sierra",
    email: "maya.sierra@pixora.io",
    fullName: "Maya Lin",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
    bio: "Backcountry Hiker & Golden Hour Chaser 🌅 Banff, Canada | Finding peace in the Canadian Rockies",
    badge: "rising",
    userStatus: "away",
    isVerified: false,
    isPremium: false,
  },
  {
    username: "tariq_dune",
    email: "tariq.dune@pixora.io",
    fullName: "Tariq Al-Mansoor",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1400&q=80",
    bio: "Desert Topography & Sand Wave Astrophotography 🏜️ Dubai & Sahara | Capturing endless dunes under starlit skies",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: false,
  },

  // Portrait & High Fashion
  {
    username: "aria_sterling",
    email: "aria.sterling@pixora.io",
    fullName: "Aria Sterling",
    profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80",
    bio: "Editorial & Avant-Garde Portrait Photographer 🎞️ | Exploring shadow, luminescence & surreal beauty | Paris / Milan",
    badge: "trendsetter",
    userStatus: "busy",
    isVerified: true,
    isPremium: true,
    socialLinks: { instagram: "https://instagram.com/aria_sterling_photo" }
  },
  {
    username: "gabriel_vogue",
    email: "gabriel.vogue@pixora.io",
    fullName: "Gabriel Rossi",
    profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=80",
    bio: "High Fashion Studio & Gel Lighting Connoisseur 💄 Milan & Rome | Creating high-impact visual stories",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "leila_noir",
    email: "leila.noir@pixora.io",
    fullName: "Leila Hassan",
    profilePicture: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80",
    bio: "Cinematic Film & 35mm Analog Portraits 🎞️ Istanbul & London | Grain, natural light and raw authentic emotions",
    badge: "rising",
    userStatus: "online",
    isVerified: false,
    isPremium: true,
  },
  {
    username: "samuel_k",
    email: "samuel.k@pixora.io",
    fullName: "Samuel Kim",
    profilePicture: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1400&q=80",
    bio: "Street Portraiture & Urban Human Stories 📷 Seoul | Documenting the vibrant characters of Hongdae & Gangnam",
    badge: "pro",
    userStatus: "away",
    isVerified: true,
    isPremium: false,
  },

  // Minimalist Architecture
  {
    username: "marcus_chen",
    email: "marcus.chen@pixora.io",
    fullName: "Marcus Chen",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80",
    bio: "Architect & Minimalist Geometry Enthusiast 🏛️ | Curating brutalist lines, natural light & organic modern spaces | Singapore",
    badge: "trendsetter",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
    socialLinks: { instagram: "https://instagram.com/marcus_architecture" }
  },
  {
    username: "hannah_bauhaus",
    email: "hannah.bauhaus@pixora.io",
    fullName: "Hannah Becker",
    profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1400&q=80",
    bio: "Bauhaus & Functionalist Spatial Curator 📐 Berlin | Less is more. Clean lines, negative space, pure form.",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "liam_brutal",
    email: "liam.brutal@pixora.io",
    fullName: "Liam O'Connor",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1400&q=80",
    bio: "Brutalist Concrete & Monolithic Structures 🏢 London | The raw poetry of geometric modernism",
    badge: "rising",
    userStatus: "offline",
    isVerified: false,
    isPremium: false,
  },
  {
    username: "yuki_space",
    email: "yuki.space@pixora.io",
    fullName: "Yuki Tanaka",
    profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80",
    bio: "Japanese Minimalist Interiors & Wabi-Sabi Aesthetics 🍵 Kyoto | Light, shadow, cedar wood, and silent beauty",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },

  // Street, Wildlife, Automotive & Macro
  {
    username: "diego_street",
    email: "diego.street@pixora.io",
    fullName: "Diego Morales",
    profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80",
    bio: "Street Scenes & Raw Latin American Colors 🎺 Mexico City & Havana | Chasing golden hour on vibrant boulevards",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: false,
  },
  {
    username: "ananya_visuals",
    email: "ananya.visuals@pixora.io",
    fullName: "Ananya Iyer",
    profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1400&q=80",
    bio: "Vibrant Festivals & Heritage Color Storytelling 🪔 Mumbai & Jaipur | Capturing the essence of culture and warmth",
    badge: "trendsetter",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "noah_wildlife",
    email: "noah.wildlife@pixora.io",
    fullName: "Noah Sterling",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1400&q=80",
    bio: "Wildlife Conservation & Safari Documentarian 🦁 Serengeti & Costa Rica | The raw majesty of the animal kingdom",
    badge: "pro",
    userStatus: "away",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "alex_apex",
    email: "alex.apex@pixora.io",
    fullName: "Alex Vance",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80",
    bio: "Supercar & Cyber-Mobility Photographer 🏎️ Nürburgring & Monaco | Speed, carbon fiber curves and tire smoke",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "ren_drifter",
    email: "ren.drifter@pixora.io",
    fullName: "Ren Hayashi",
    profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=80",
    bio: "Touge Night Runs & JDM Culture 🔰 Hakone | Classic 90s chassis under misty mountain sodium lamps",
    badge: "rising",
    userStatus: "online",
    isVerified: true,
    isPremium: false,
  }
];

const masterImagesLibrary = [
  // Cyberpunk
  {
    creator: "kai_takahashi",
    title: "Midnight Shinjuku Rain Reflections",
    description: "Rain-drenched neon alleys of Shinjuku glowing in vibrant magenta, amber, and electric turquoise reflections.",
    imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85",
    category: "cyberpunk",
    tags: ["cyberpunk", "tokyo", "neon", "rain", "night", "cityscape", "japan"],
  },
  {
    creator: "elena_rostova",
    title: "Chroma Operative: Sector 7",
    description: "Futuristic android scout equipped with fiber-optic katana standing atop a neon-lit skyscraper overlooking a dystopian city.",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85",
    category: "cyberpunk",
    tags: ["cyberpunk", "scifi", "character", "neon", "warrior", "futuristic"],
  },
  {
    creator: "cypher_k",
    title: "Neural Gateway: Core Processor",
    description: "Bioluminescent optical circuitry pulsing with cyan data packets inside an underground server sanctuary.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
    category: "cyberpunk",
    tags: ["cyberpunk", "ai", "hardware", "technology", "circuits", "scifi"],
  },
  {
    creator: "nyx_shadow",
    title: "Neo-Seoul Holographic Crossroads",
    description: "Towering holographic ads floating above multi-tiered highway flyovers in a dense misty metropolis.",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
    category: "cyberpunk",
    tags: ["cyberpunk", "seoul", "hologram", "cityscape", "night", "futuristic"],
  },
  {
    creator: "zane_quantum",
    title: "Outrun 2084: Turbo Horizon",
    description: "Glowing magenta neon wireframe horizon with a chrome sports car speeding toward a synthwave sun.",
    imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=85",
    category: "cyberpunk",
    tags: ["synthwave", "retrowave", "outrun", "cyberpunk", "neon", "sunset"],
  },
  {
    creator: "ren_drifter",
    title: "Tokyo Underground: Drift Protocol",
    description: "Modified Japanese sports car drifting through wet asphalt under neon signs with blazing tail light trails.",
    imageUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=85",
    category: "cyberpunk",
    tags: ["cyberpunk", "jdm", "cars", "night", "drift", "tokyo"],
  },

  // Landscape
  {
    creator: "lucas_muller",
    title: "Alpine Crown: First Light on Matterhorn",
    description: "Golden alpine glow illuminating the jagged snowy peak of the Matterhorn across an undisturbed crystal tarn.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
    category: "landscape",
    tags: ["landscape", "mountains", "alps", "sunrise", "nature", "matterhorn"],
  },
  {
    creator: "freja_nordic",
    title: "Celestial Veil: Reine Aurora",
    description: "Dancing curtains of bright emerald aurora borealis arching over snow-covered Lofoten peaks and red rorbu cabins.",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85",
    category: "landscape",
    tags: ["aurora", "northernlights", "norway", "arctic", "landscape", "winter"],
  },
  {
    creator: "ethan_wild",
    title: "Emerald Sanctuary: Hidden Redwood Falls",
    description: "Lush fern canyon veiled in sunbeams penetrating through ancient redwoods onto a cascading moss waterfall.",
    imageUrl: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1200&q=85",
    category: "landscape",
    tags: ["waterfall", "nature", "redwoods", "forest", "emerald", "pacificnorthwest"],
  },
  {
    creator: "maya_sierra",
    title: "Moraine Blue: Glacier Reflections",
    description: "Iridescent turquoise glacier waters of Lake Moraine perfectly mirroring the Valley of the Ten Peaks.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
    category: "landscape",
    tags: ["banff", "canada", "mountains", "lake", "turquoise", "landscape"],
  },
  {
    creator: "tariq_dune",
    title: "Crimson Sands: Starry Sahara Dunes",
    description: "Wind-sculpted golden dunes casting sharp shadow knife-edges under the dazzling arch of the Milky Way galaxy.",
    imageUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=85",
    category: "landscape",
    tags: ["desert", "dunes", "sahara", "stars", "landscape", "astrophotography"],
  },
  {
    creator: "lucas_muller",
    title: "Patagonia Jagged Towers at Sunset",
    description: "Fiery orange and magenta clouds crowning the granite spires of Torres del Paine above iceberg-filled lagoons.",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85",
    category: "landscape",
    tags: ["patagonia", "chile", "mountains", "sunset", "epic", "landscape"],
  },

  // Abstract
  {
    creator: "sophia_vance",
    title: "Prismatic Ribbon: Chromatic Refraction",
    description: "Twisted 3D glass ribbon refracting rainbow caustics across a deep obsidian velvet surface.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85",
    category: "abstract",
    tags: ["abstract", "3d", "glass", "chromatic", "refraction", "render"],
  },
  {
    creator: "chloe_dubois",
    title: "Cosmic Liquid Marbling: Royal Gold & Indigo",
    description: "Macro photographic fluid art featuring metallic 24k gold leaf swirling inside deep royal indigo resin.",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85",
    category: "abstract",
    tags: ["abstract", "fluidart", "gold", "indigo", "marbling", "psychedelic"],
  },
  {
    creator: "mateo_prism",
    title: "Floating Chrome & Glass Spheres",
    description: "Zero-gravity procedural physics render of floating chrome and translucent glass spheres distorting ambient sunset light.",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85",
    category: "abstract",
    tags: ["3d", "render", "chrome", "spheres", "glassmorphism", "minimal"],
  },
  {
    creator: "aurora_flux",
    title: "Iridescent Kinetic Fabric",
    description: "Ethereal silk simulation floating in vacuum space, catching vibrant holographic pastel highlights.",
    imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=85",
    category: "abstract",
    tags: ["abstract", "fabric", "holographic", "pastel", "3d", "motion"],
  },
  {
    creator: "devon_render",
    title: "Architectural Gradient Void",
    description: "Minimalist volumetric lighting illuminating curved concrete apertures with a soft sunset purple-to-peach gradient.",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85",
    category: "abstract",
    tags: ["abstract", "gradient", "architecture", "lighting", "minimal"],
  },

  // Portrait
  {
    creator: "aria_sterling",
    title: "Ethereal Noir: Cyan & Crimson Gel",
    description: "High-contrast editorial beauty portrait with dual-tone cinematic gel lighting emphasizing bone structure and eyes.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
    category: "portrait",
    tags: ["portrait", "editorial", "fashion", "cinematic", "lighting", "model"],
  },
  {
    creator: "gabriel_vogue",
    title: "Golden Hour Soliloquy",
    description: "Warm sunset portrait in a wheat field with backlit golden bokeh and gentle natural wind-blown hair.",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=85",
    category: "portrait",
    tags: ["portrait", "goldenhour", "natural", "warmth", "bokeh", "editorial"],
  },
  {
    creator: "leila_noir",
    title: "35mm Grain: Parisian Café Gaze",
    description: "Moody vintage 35mm film portrait through a rain-flecked window in an authentic Saint-Germain café.",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85",
    category: "portrait",
    tags: ["portrait", "film", "35mm", "vintage", "paris", "street"],
  },
  {
    creator: "samuel_k",
    title: "Seoul Neon Silhouette: Midnight muse",
    description: "Aesthetic silhouette profile illuminated from behind by the soft glow of a green neon coffee shop sign.",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85",
    category: "portrait",
    tags: ["portrait", "silhouette", "neon", "seoul", "night", "moody"],
  },

  // Minimal
  {
    creator: "marcus_chen",
    title: "Brutalist Monolith: Geometry in Concrete",
    description: "Raw cantilevered exposed concrete forms casting sharp diagonal shadows against a deep Mediterranean blue sky.",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
    category: "minimal",
    tags: ["minimal", "architecture", "brutalist", "shadows", "lines", "concrete"],
  },
  {
    creator: "hannah_bauhaus",
    title: "Helix Spiral: Infinite Geometry",
    description: "Hypnotic top-down symmetrical view of a pristine white spiraling architectural staircase.",
    imageUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=85",
    category: "minimal",
    tags: ["minimal", "staircase", "symmetry", "architecture", "spiral", "monochrome"],
  },
  {
    creator: "liam_brutal",
    title: "Light & Shadow in the Barbican",
    description: "Geometric repetition of brutalist concrete balconies in central London bathed in late afternoon sun.",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85",
    category: "minimal",
    tags: ["architecture", "minimal", "london", "barbican", "brutalism"],
  },
  {
    creator: "yuki_space",
    title: "Wabi-Sabi Shadowplay: Kyoto Pavilion",
    description: "Serene bamboo screen casting delicate horizontal slatted shadows across natural tatami mat floors.",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
    category: "minimal",
    tags: ["minimal", "kyoto", "japan", "shadows", "peaceful", "zen"],
  },

  // Other
  {
    creator: "zane_quantum",
    title: "Spacewalk Over Andromeda",
    description: "Astronaut floating peacefully in low orbit with the dazzling purple core of the Andromeda galaxy in the background.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85",
    category: "other",
    tags: ["space", "astronaut", "cosmos", "galaxy", "stars", "universe"],
  },
  {
    creator: "alex_apex",
    title: "Monaco Hypercar: Carbon Fiber Symphony",
    description: "Matte black hypercar parked on the Monte Carlo hairpin at twilight with glowing red LED taillights.",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85",
    category: "other",
    tags: ["cars", "hypercar", "monaco", "automotive", "luxury", "speed"],
  },
  {
    creator: "noah_wildlife",
    title: "Serengeti Monarch: Golden Sunset Lion",
    description: "Majestic male lion with a full dark mane resting on a sun-warmed kopje rock in the golden African sunset.",
    imageUrl: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1200&q=85",
    category: "other",
    tags: ["wildlife", "lion", "safari", "africa", "nature", "animals"],
  },
  {
    creator: "diego_street",
    title: "Havana Tropicana: Classic 50s Cadillac",
    description: "Turquoise vintage 1957 convertible parked in front of pastel colonial architecture on the Malecón in Havana.",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
    category: "other",
    tags: ["cuba", "vintage", "cars", "classic", "street", "pastel"],
  }
];

const commentsPool = [
  "The color grading on this is out of this world! Incredible work! 🔥",
  "Saved to my inspiration board immediately! The lighting is so clean ✨",
  "The atmosphere and depth here give me goosebumps. Brilliant composition!",
  "What camera / software pipeline did you use for this render? Phenomenal.",
  "This is pure visual poetry. Love the mood and tones! 👏",
  "The details in the reflections are unreal! Featured quality work. 💎",
  "One of the best posts I've seen on Pixora this week! Keep creating! 🚀",
  "The symmetry and balance in this shot are so satisfying to look at.",
  "Stunning contrast between the warm highlights and cold shadow tones! 🎨",
  "Such a powerful mood! Definitely giving this a favorite! ❤️",
  "The subtle grain and texture add so much character to this piece. 📸",
  "Everything about this composition just works flawlessly. Masterpiece! 🌟"
];

async function seedFast() {
  try {
    await mongoose.connect(`${mongoURI}/${DB_NAME}`);
    console.log("🚀 Connected to MongoDB Atlas");

    const hashedPassword = await bcrypt.hash("Test@123", 10);
    const creatorPassword = await bcrypt.hash("PixoraUser2026!", 10);

    // 1. Setup Demo User
    let demoUser = await User.findOne({ email: "demo@pixora.io" });
    if (!demoUser) {
      demoUser = new User({
        username: "pixora_demo",
        email: "demo@pixora.io",
        fullName: "Pixora Explorer (Demo)",
        password: hashedPassword,
        provider: "credentials",
        profileVisibility: "public",
      });
    }
    demoUser.password = hashedPassword;
    demoUser.fullName = "Pixora Explorer (Demo)";
    demoUser.profilePicture = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80";
    demoUser.coverPicture = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85";
    demoUser.bio = "🌟 Official Pixora Live Demo Account | Explore, curate collections, save inspirations & connect with creators across the globe!";
    demoUser.badge = "trendsetter";
    demoUser.userStatus = "online";
    demoUser.isVerified = true;
    demoUser.isPremium = true;
    demoUser.socialLinks = {
      instagram: "https://instagram.com/pixora.app",
      twitter: "https://twitter.com/pixora_app",
      facebook: "https://facebook.com/pixora"
    };
    await demoUser.save();
    console.log(`✅ Demo Account: demo@pixora.io / Password: Test@123`);

    // 2. Fetch Vitrag Shah
    const vitrag = await User.findOne({ email: "vitragshah2108@gmail.com" });

    // 3. Batch Create/Update 28 Creators
    const creatorUserMap = {};
    for (const cData of creatorsData) {
      let creator = await User.findOne({ email: cData.email });
      if (!creator) {
        creator = new User({
          ...cData,
          password: creatorPassword,
          provider: "credentials",
          profileVisibility: "public",
        });
      } else {
        Object.assign(creator, cData);
        creator.password = creatorPassword;
      }
      await creator.save();
      creatorUserMap[cData.username] = creator;
    }
    console.log(`✅ ${creatorsData.length} Global Creators ready.`);

    const allActiveUsers = [demoUser, ...(vitrag ? [vitrag] : []), ...Object.values(creatorUserMap)];
    const allUserIds = allActiveUsers.map(u => u._id);

    // 4. Batch Insert Images
    const newImagesToInsert = [];
    for (let i = 0; i < masterImagesLibrary.length; i++) {
      const imgData = masterImagesLibrary[i];
      const author = creatorUserMap[imgData.creator] || demoUser;
      const exists = await Image.findOne({ title: imgData.title, user: author._id });
      if (!exists) {
        newImagesToInsert.push({
          user: author._id,
          title: imgData.title,
          description: imgData.description,
          imageUrl: imgData.imageUrl,
          publicId: `pixora_master_${author.username}_${i}`,
          category: imgData.category,
          license: i % 2 === 0 ? "extended" : "standard",
          tags: imgData.tags,
          imageSize: Math.floor(Math.random() * 2000) + 3500,
          visibility: "public",
          commentsAllowed: true,
          likesCount: 0,
          favoritesCount: 0,
          commentsCount: 0,
        });
      }
    }
    if (newImagesToInsert.length > 0) {
      await Image.insertMany(newImagesToInsert);
      console.log(`✅ Inserted ${newImagesToInsert.length} new master gallery images.`);
    }

    const allImages = await Image.find({ user: { $in: allUserIds } });
    console.log(`✅ Total active images in platform: ${allImages.length}`);

    // 5. Batch Follows
    const followDocs = [];
    const followPairs = new Set();
    const existingFollows = await Follow.find({});
    existingFollows.forEach(f => followPairs.add(`${f.follower.toString()}_${f.following.toString()}`));

    for (const source of allActiveUsers) {
      const targets = allActiveUsers.filter(u => u._id.toString() !== source._id.toString());
      // Follow demoUser and vitrag
      for (const target of targets) {
        const isPriorityTarget = (target._id.toString() === demoUser._id.toString() || (vitrag && target._id.toString() === vitrag._id.toString()));
        const shouldFollow = isPriorityTarget || Math.random() > 0.45;
        const key = `${source._id.toString()}_${target._id.toString()}`;
        if (shouldFollow && !followPairs.has(key)) {
          followDocs.push({ follower: source._id, following: target._id });
          followPairs.add(key);
        }
      }
    }
    if (followDocs.length > 0) {
      await Follow.insertMany(followDocs, { ordered: false }).catch(() => {});
      console.log(`✅ Batch inserted ${followDocs.length} follow connections.`);
    }

    // 6. Batch Likes & Favorites
    const likeDocs = [];
    const favDocs = [];
    const existingLikes = await Like.find({});
    const likePairs = new Set();
    existingLikes.forEach(l => likePairs.add(`${l.user.toString()}_${l.image.toString()}`));

    const existingFavs = await Favorite.find({});
    const favPairs = new Set();
    existingFavs.forEach(f => favPairs.add(`${f.user.toString()}_${f.image.toString()}`));

    for (const image of allImages) {
      const shuffled = [...allActiveUsers].sort(() => 0.5 - Math.random());
      // 8 to 20 likes per image
      const likers = shuffled.slice(0, Math.floor(Math.random() * 12) + 8);
      for (const u of likers) {
        const key = `${u._id.toString()}_${image._id.toString()}`;
        if (!likePairs.has(key)) {
          likeDocs.push({ user: u._id, image: image._id });
          likePairs.add(key);
        }
      }
      // 3 to 8 favorites per image
      const favUsers = shuffled.slice(0, Math.floor(Math.random() * 5) + 3);
      for (const u of favUsers) {
        const key = `${u._id.toString()}_${image._id.toString()}`;
        if (!favPairs.has(key)) {
          favDocs.push({ user: u._id, image: image._id });
          favPairs.add(key);
        }
      }
    }

    if (likeDocs.length > 0) {
      await Like.insertMany(likeDocs, { ordered: false }).catch(() => {});
    }
    if (favDocs.length > 0) {
      await Favorite.insertMany(favDocs, { ordered: false }).catch(() => {});
    }
    console.log(`✅ Batch inserted ${likeDocs.length} likes and ${favDocs.length} favorites.`);

    // 7. Batch Comments
    const commentDocs = [];
    for (const image of allImages) {
      const commentators = allActiveUsers
        .filter(u => u._id.toString() !== image.user.toString())
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 2);

      for (const cUser of commentators) {
        const randomText = commentsPool[Math.floor(Math.random() * commentsPool.length)];
        commentDocs.push({
          user: cUser._id,
          image: image._id,
          text: randomText,
        });
      }
    }
    if (commentDocs.length > 0) {
      await Comment.insertMany(commentDocs, { ordered: false }).catch(() => {});
      console.log(`✅ Batch inserted ${commentDocs.length} discussion comments.`);
    }

    // 8. Collections for Demo User
    const cyberpunkImages = allImages.filter(i => i.category === 'cyberpunk').map(i => i._id);
    const landscapeImages = allImages.filter(i => i.category === 'landscape').map(i => i._id);
    const abstractImages = allImages.filter(i => i.category === 'abstract').map(i => i._id);
    const minimalImages = allImages.filter(i => i.category === 'minimal').map(i => i._id);

    const demoCollections = [
      {
        user: demoUser._id,
        name: "⚡ Cyberpunk & Neon Dystopias",
        description: "Best futuristic neon streetscapes, cyberpunk mecha warriors & synthwave dreams across Pixora.",
        coverImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85",
        visibility: "public",
        images: cyberpunkImages.slice(0, 8),
        tags: ["cyberpunk", "neon", "tokyo", "scifi"],
        isStarred: true,
      },
      {
        user: demoUser._id,
        name: "🏔️ Majestic Global Horizons",
        description: "Breathtaking mountain peaks, serene glacier lakes, and auroras from the Arctic to Patagonia.",
        coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
        visibility: "public",
        images: landscapeImages.slice(0, 8),
        tags: ["nature", "mountains", "landscape", "adventure"],
        isStarred: true,
      },
      {
        user: demoUser._id,
        name: "💎 3D Glass & Kinetic Geometry",
        description: "Mesmerizing prismatic caustics, chromatic glass simulations, and liquid metals.",
        coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85",
        visibility: "public",
        images: abstractImages.slice(0, 8),
        tags: ["3d", "abstract", "glass", "render"],
        isStarred: true,
      },
      {
        user: demoUser._id,
        name: "🏛️ Modern Minimalist Architecture",
        description: "Brutalist forms, negative space harmony, concrete angles and timeless spatial design.",
        coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
        visibility: "public",
        images: minimalImages.slice(0, 8),
        tags: ["architecture", "minimal", "design"],
        isStarred: false,
      }
    ];

    for (const dCol of demoCollections) {
      const existing = await Collection.findOne({ user: demoUser._id, name: dCol.name });
      if (!existing) {
        await Collection.create(dCol);
      }
    }
    console.log(`✅ Demo flagship collections created.`);

    // 9. Sync image counts
    console.log("🔄 Synchronizing image metrics...");
    for (const img of allImages) {
      const likesCount = await Like.countDocuments({ image: img._id });
      const favsCount = await Favorite.countDocuments({ image: img._id });
      const commentsCount = await Comment.countDocuments({ image: img._id });
      await Image.updateOne({ _id: img._id }, { likesCount, favoritesCount: favsCount, commentsCount });
    }

    // 10. Sync user metrics
    console.log("🔄 Synchronizing user metrics...");
    for (const u of allActiveUsers) {
      const uImages = await Image.find({ user: u._id });
      const followersCount = await Follow.countDocuments({ following: u._id });
      const followingCount = await Follow.countDocuments({ follower: u._id });
      const totalLikes = uImages.reduce((sum, img) => sum + (img.likesCount || 0), 0);
      const storageUsed = uImages.reduce((sum, img) => sum + (img.imageSize || 4000), 0);

      await User.updateOne(
        { _id: u._id },
        {
          postsCount: uImages.length,
          followersCount,
          followingCount,
          likesCount: totalLikes,
          storageUsed,
          interactionsCount: (totalLikes * 1) + (followersCount * 2) + (uImages.length * 3),
          badge: totalLikes > 50 || followersCount > 15 ? "trendsetter" : (followersCount > 8 ? "pro" : "rising")
        }
      );
    }

    console.log("🎉 Master platform seed successfully completed!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding fast:", err);
    process.exit(1);
  }
}

seedFast();
