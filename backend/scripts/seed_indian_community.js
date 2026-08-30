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

// 35+ Authentic Indian Creators
const indianCreatorsData = [
  {
    username: "rohan_sharma",
    email: "rohan.sharma@pixora.in",
    fullName: "Rohan Sharma",
    profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
    bio: "Himalayan High Altitude Explorer & Astrophotographer 🏔️ 🌌 | Chasing Milky Way arches over Ladakh, Spiti & Kashmir | Based in Manali",
    badge: "trendsetter",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
    socialLinks: { instagram: "https://instagram.com/rohan_himalayas", twitter: "https://twitter.com/rohansharma_art" }
  },
  {
    username: "priya_deshmukh",
    email: "priya.deshmukh@pixora.in",
    fullName: "Priya Deshmukh",
    profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80",
    bio: "Heritage Architecture & Royal Rajasthan Curator 🏛️ 🪔 Jaipur & Udaipur | Documenting jharokhas, stepwells & forgotten royal forts",
    badge: "trendsetter",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
    socialLinks: { instagram: "https://instagram.com/priya_heritage" }
  },
  {
    username: "aarav_patel",
    email: "aarav.patel@pixora.in",
    fullName: "Aarav Patel",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=80",
    bio: "Street & Chai Culture Documentarian ☕ 📸 Ahmedabad & Mumbai | Capturing golden hour on old pol streets and bustling local bazaars",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: false,
    socialLinks: { instagram: "https://instagram.com/aarav_streets", twitter: "https://twitter.com/aaravpatel_in" }
  },
  {
    username: "kavya_sundaram",
    email: "kavya.sundaram@pixora.in",
    fullName: "Kavya Sundaram",
    profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1400&q=80",
    bio: "Dravidian Temple Art & Classical Dance Photographer 🛕 💃 Chennai & Thanjavur | Sacred gopurams, stone sculptures & Bharatanatyam grace",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "arjun_kapoor_art",
    email: "arjun.kapoor@pixora.in",
    fullName: "Arjun Kapoor",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80",
    bio: "Cyberpunk Mumbai & Urban Nightscapes 🏙️ ⚡ Sea Link long exposures, monsoon reflections & neon street energy",
    badge: "trendsetter",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
    socialLinks: { instagram: "https://instagram.com/arjun_mumbai_night" }
  },
  {
    username: "meera_nair",
    email: "meera.nair@pixora.in",
    fullName: "Meera Nair",
    profilePicture: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
    bio: "God's Own Country Explorer 🌴 🛶 Munnar tea hills, Alleppey backwater houseboats & morning mist in Wayanad | Kerala",
    badge: "pro",
    userStatus: "away",
    isVerified: true,
    isPremium: false,
  },
  {
    username: "aditya_verma",
    email: "aditya.verma@pixora.in",
    fullName: "Aditya Verma",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80",
    bio: "Spiritual Light & Varanasi Ghats 🪔 🌅 Documenting sunrise prayers on the Ganga, Ganga Aarti flame rhythms & sadhu portraits",
    badge: "trendsetter",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "sneha_mukherjee",
    email: "sneha.mukherjee@pixora.in",
    fullName: "Sneha Mukherjee",
    profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1400&q=80",
    bio: "City of Joy Documentarian 🚋 🎨 Kolkata vintage trams, yellow ambassadors, Kumartuli idol sculptors & Durga Puja celebrations",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: false,
  },
  {
    username: "vikram_singh",
    email: "vikram.singh@pixora.in",
    fullName: "Vikramaditya Singh",
    profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1400&q=80",
    bio: "Royal Forts & Thar Desert Horizons 🐪 🏰 Jodhpur & Jaisalmer | Golden sand dunes, royal cenotaphs & desert camel caravans",
    badge: "trendsetter",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "ananya_rao",
    email: "ananya.rao@pixora.in",
    fullName: "Ananya Rao",
    profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80",
    bio: "3D Motion Designer & Modern Indian Visualist 💎 🇮🇳 Bengaluru | Blending Indian mythological motifs with futuristic glass & kinetic art",
    badge: "trendsetter",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "siddharth_malhotra",
    email: "siddharth.malhotra@pixora.in",
    fullName: "Siddharth Malhotra",
    profilePicture: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80",
    bio: "Old Delhi Heritage & Spice Bazaar Lights 🕌 🍲 Chandni Chowk, Jama Masjid sunbeams, morning paranthe & narrow alleys",
    badge: "rising",
    userStatus: "busy",
    isVerified: false,
    isPremium: true,
  },
  {
    username: "tanmay_joshi",
    email: "tanmay.joshi@pixora.in",
    fullName: "Tanmay Joshi",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1400&q=80",
    bio: "Sahyadri Monsoon Treks & Western Ghats Biodiversity 🌧️ 🍃 Pune | Roaring cliffside waterfalls & fog-covered mountain passes",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: false,
  },
  {
    username: "diya_nambiar",
    email: "diya.nambiar@pixora.in",
    fullName: "Diya Nambiar",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1400&q=80",
    bio: "Theyyam, Kathakali & South Indian Ritual Art 🎭 🔥 Documenting vibrant face paints, fiery headgears & midnight temple rituals",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "ishaan_trivedi",
    email: "ishaan.trivedi@pixora.in",
    fullName: "Ishaan Trivedi",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
    bio: "Spiti Valley & Pangong Lake Expeditionist ❄️ 🌌 Key Monastery snowfalls, Chicham Bridge & Chandratal reflections",
    badge: "trendsetter",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "natasha_pillai",
    email: "natasha.pillai@pixora.in",
    fullName: "Natasha Pillai",
    profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1400&q=80",
    bio: "Goa Portuguese Architecture & Coastal Sunsets 🏖️ ⛪ Fontainhas yellow villas, red laterite chapels & palm fringed shores",
    badge: "rising",
    userStatus: "online",
    isVerified: false,
    isPremium: true,
  },
  {
    username: "varun_chawla",
    email: "varun.chawla@pixora.in",
    fullName: "Varun Chawla",
    profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    bio: "Cyber-Delhi & Metro Aesthetics 🚇 ⚡ Gurgaon glass skyline, Cyber Hub reflections & dusk commuter silhouettes",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "aditi_saxena",
    email: "aditi.saxena@pixora.in",
    fullName: "Aditi Saxena",
    profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80",
    bio: "Mughal Symmetry & Monumental Majesty 🕌 🤍 Agra & Delhi | Taj Mahal dawn mist, red sandstone arches & marble inlays",
    badge: "trendsetter",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "harsha_reddy",
    email: "harsha.reddy@pixora.in",
    fullName: "Harshavardhan Reddy",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80",
    bio: "Charminar Night Rhythms & Golconda Fort Shadows 🏰 🌙 Hyderabad | Nizami heritage, glass bangle markets & sunset over Hussain Sagar",
    badge: "pro",
    userStatus: "away",
    isVerified: true,
    isPremium: false,
  },
  {
    username: "neha_kashyap",
    email: "neha.kashyap@pixora.in",
    fullName: "Neha Kashyap",
    profilePicture: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1400&q=80",
    bio: "Northeast India Paradise 🌿 🌧️ Meghalaya living root bridges, Dawki crystal river & misty tea estates of Assam",
    badge: "trendsetter",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "pranav_bhatt",
    email: "pranav.bhatt@pixora.in",
    fullName: "Pranav Bhatt",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1400&q=80",
    bio: "White Desert of Kutch & Full Moon Star Trails 🌕 🏜️ Rann of Kutch | Where white salt crust meets celestial night skies",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "yash_vardhan",
    email: "yash.vardhan@pixora.in",
    fullName: "Yash Vardhan",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1400&q=80",
    bio: "Wildlife Photographer & Tiger Tracker 🐅 📸 Ranthambore, Jim Corbett & Tadoba | Majestic Royal Bengal Tigers in their realm",
    badge: "trendsetter",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "radhika_singhania",
    email: "radhika.singhania@pixora.in",
    fullName: "Radhika Singhania",
    profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=80",
    bio: "Royal Indian Couture & Bridal Heritage 👑 🥻 Udaipur & Jaipur | Rich Benarasi silks, royal palaces & cinematic bridal portraits",
    badge: "trendsetter",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  },
  {
    username: "simran_kaur",
    email: "simran.kaur@pixora.in",
    fullName: "Simran Kaur",
    profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80",
    bio: "Golden Temple Reflections & Amritsar Spirit 🪔 ✨ Golden hour reflections on the Amrit Sarovar & langar seva warmth",
    badge: "pro",
    userStatus: "online",
    isVerified: true,
    isPremium: false,
  },
  {
    username: "chirag_shah",
    email: "chirag.shah@pixora.in",
    fullName: "Chirag Shah",
    profilePicture: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
    coverPicture: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1400&q=80",
    bio: "Festivals of Colors & Navratri Nights 💃 🎆 Vadodara & Surat | Millions twirling in chaniya cholis under sparkling floodlights",
    badge: "rising",
    userStatus: "online",
    isVerified: true,
    isPremium: true,
  }
];

// 30+ Authentic Master Indian Artworks & Photographs
const indianArtworksLibrary = [
  // 1. Heritage, Monuments & Temples (Category: landscape / minimal / other)
  {
    creator: "aditi_saxena",
    title: "Taj Mahal Dawn: Serenade in White Marble",
    description: "The world wonder Taj Mahal glowing in soft peach morning mist, perfectly reflected in the tranquil central lotus pool.",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=85",
    category: "landscape",
    tags: ["tajmahal", "india", "agra", "monument", "marble", "sunrise", "unesco"],
  },
  {
    creator: "simran_kaur",
    title: "Golden Temple: Illumination on Sacred Waters",
    description: "Golden Temple (Harmandir Sahib) in Amritsar radiating golden light across the midnight waters of the holy Amrit Sarovar.",
    imageUrl: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1200&q=85",
    category: "landscape",
    tags: ["goldentemple", "amritsar", "punjab", "spiritual", "peace", "night", "india"],
  },
  {
    creator: "aditya_verma",
    title: "Ganga Aarti at Dashashwamedh Ghat",
    description: "Varanasi priests performing the sacred twilight fire rituals on the banks of the sacred river Ganga with chanting devotees.",
    imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=85",
    category: "other",
    tags: ["varanasi", "ganga", "aarti", "spiritual", "fire", "ghats", "kashi"],
  },
  {
    creator: "priya_deshmukh",
    title: "Hawa Mahal: The Palace of Winds",
    description: "Intricate pink sandstone jharokhas and latticed honeycomb windows of Hawa Mahal under glowing golden hour sunlight in Jaipur.",
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=85",
    category: "minimal",
    tags: ["jaipur", "hawamahal", "rajasthan", "pinkcity", "architecture", "heritage"],
  },
  {
    creator: "kavya_sundaram",
    title: "Meenakshi Amman Gopuram: Sculptural Symphony",
    description: "Towering ancient Dravidian temple gopuram in Madurai adorned with thousands of intricately painted mythological sculptures.",
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85",
    category: "other",
    tags: ["madurai", "temple", "tamilnadu", "sculptures", "dravidian", "heritage"],
  },
  {
    creator: "vikram_singh",
    title: "Mehrangarh Fort: Crown of the Blue City",
    description: "Massive 15th-century cliffside ramparts of Mehrangarh Fort rising majestically above the indigo blue houses of Jodhpur.",
    imageUrl: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=85",
    category: "landscape",
    tags: ["jodhpur", "mehrangarh", "bluecity", "fort", "rajasthan", "history"],
  },

  // 2. Himalayan & Indian Natural Landscapes (Category: landscape)
  {
    creator: "rohan_sharma",
    title: "Pangong Tso: The High Altitude Sapphire",
    description: "Crystal-clear turquoise waters of Pangong Lake in Ladakh nestled at 14,000 ft between barren Himalayan mountain passes.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
    category: "landscape",
    tags: ["ladakh", "pangong", "himalayas", "mountains", "turquoise", "lake", "india"],
  },
  {
    creator: "ishaan_trivedi",
    title: "Key Monastery: The Spiti Valley Fortress",
    description: "Ancient 1000-year-old Buddhist monastery perched on a conical hill amidst the snow-dusted stark landscape of Spiti Valley.",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85",
    category: "landscape",
    tags: ["spiti", "monastery", "snow", "himalayas", "buddhism", "serene"],
  },
  {
    creator: "meera_nair",
    title: "Munnar Emerald Carpets: Tea Estate Dawn",
    description: "Undulating hills covered in manicured tea plantations shrouded in delicate morning mist in the Western Ghats of Kerala.",
    imageUrl: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1200&q=85",
    category: "landscape",
    tags: ["kerala", "munnar", "tea", "greenery", "nature", "hills", "mist"],
  },
  {
    creator: "neha_kashyap",
    title: "Dawki River: Floating on Liquid Glass",
    description: "Traditional wooden country boats floating on the hyper-transparent crystal waters of Umngot River in Dawki, Meghalaya.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
    category: "landscape",
    tags: ["dawki", "meghalaya", "river", "crystalclear", "northeastindia", "nature"],
  },
  {
    creator: "pranav_bhatt",
    title: "Rann of Kutch: Endless White Salt Desert",
    description: "The surreal salt flat desert of Great Rann of Kutch glowing under the warm golden sunset horizon.",
    imageUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=85",
    category: "landscape",
    tags: ["kutch", "rannofkutch", "gujarat", "saltdesert", "sunset", "horizon"],
  },
  {
    creator: "tanmay_joshi",
    title: "Sahyadri Monsoon Cascades: Reverse Waterfall",
    description: "Raging monsoon waterfalls cascading down lush green Sahyadri cliffs with dramatic storm clouds in Maharashtra.",
    imageUrl: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1200&q=85",
    category: "landscape",
    tags: ["sahyadri", "monsoon", "waterfall", "westernghats", "pune", "maharashtra"],
  },

  // 3. Cyberpunk & Urban Nightscapes of Modern India (Category: cyberpunk)
  {
    creator: "arjun_kapoor_art",
    title: "Bandra-Worli Sea Link: Neon Veins of Mumbai",
    description: "Long exposure cable-stayed bridge illuminated with electric cyan and magenta lights curving across the Arabian Sea.",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85",
    category: "cyberpunk",
    tags: ["mumbai", "sealink", "cyberpunk", "night", "longexposure", "cityscape", "neon"],
  },
  {
    creator: "varun_chawla",
    title: "Cyber-Gurgaon: Glass Monoliths at Twilight",
    description: "Sleek glass skyscrapers and cybernetic rapid metro lines weaving through Gurgaon's futuristic corporate corridor.",
    imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85",
    category: "cyberpunk",
    tags: ["delhi", "gurgaon", "cyberpunk", "skyline", "metro", "modernindia"],
  },
  {
    creator: "ananya_rao",
    title: "Digital Mandala: 3D Refraction Synthesis",
    description: "Hyper-detailed 3D glass simulation fusing sacred Vedic geometric mandala patterns with iridescent holographic light caustics.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85",
    category: "abstract",
    tags: ["3d", "mandala", "abstract", "glassmorphism", "indic", "futuristic", "render"],
  },

  // 4. Portraits, Classical Arts & Indian Culture (Category: portrait / other)
  {
    creator: "radhika_singhania",
    title: "The Royal Rajputi Bride: Heritage Splendor",
    description: "Cinematic portrait of a bride wearing intricate hand-embroidered royal red poshak, heritage polki jewelry and borla in a palace courtyard.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
    category: "portrait",
    tags: ["portrait", "bridal", "rajasthan", "royal", "culture", "jewelry", "fashion"],
  },
  {
    creator: "diya_nambiar",
    title: "Kathakali Expression: Navarasas in Green & Gold",
    description: "Intense close-up portrait of a Kathakali master in traditional Paccha makeup expressing deep spiritual devotion through eyes.",
    imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=85",
    category: "portrait",
    tags: ["kathakali", "kerala", "culture", "portrait", "dance", "art", "navarasa"],
  },
  {
    creator: "aarav_patel",
    title: "Old Ahmedabad Chaiwallah: Steam & Warmth",
    description: "Authentic street portrait of a smiling tea vendor pouring boiling cutting chai from heights with golden morning steam.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85",
    category: "portrait",
    tags: ["streetphotography", "chai", "ahmedabad", "portrait", "culture", "india"],
  },

  // 5. Wildlife & Festivals of India (Category: other)
  {
    creator: "yash_vardhan",
    title: "The Bengal Monarch: Tiger of Ranthambore",
    description: "Stunning telephoto portrait of a dominant male Royal Bengal Tiger stepping through golden monsoon forest grasses.",
    imageUrl: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1200&q=85",
    category: "other",
    tags: ["wildlife", "tiger", "ranthambore", "bengaltiger", "nature", "safari"],
  },
  {
    creator: "chirag_shah",
    title: "Navratri Garba: Colors in Motion",
    description: "Aerial high-shutter speed photograph of thousands of dancers in vibrant traditional mirror-work lehengas circling in synchrony.",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85",
    category: "other",
    tags: ["navratri", "garba", "gujarat", "festival", "colors", "celebration"],
  },
  {
    creator: "sneha_mukherjee",
    title: "Kolkata Tramway: Journey Through Time",
    description: "Vintage 1950s blue and yellow tram gliding down College Street amidst morning mist and old colonial bookshops.",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
    category: "other",
    tags: ["kolkata", "tram", "heritage", "street", "vintage", "cityofjoy"],
  }
];

const indianCommentsPool = [
  "Incredible shot brother! The lighting on this is pure magic! 🔥🇮🇳",
  "Proud to see such rich Indian heritage showcased so beautifully on Pixora! ✨",
  "Pangong lake is truly paradise on earth! Beautiful composition Rohan bhai 🏔️",
  "The reflection on the water looks so serene. Outstanding photography! 👏",
  "Varanasi morning devotion captured in its truest spiritual essence 🙏🪔",
  "Mumbai monsoons giving pure cyberpunk aesthetics! Masterpiece shot.",
  "Which lens and shutter speed did you use for this capture? Stunning clarity!",
  "Saved straight to my Incredible India moodboard! Superb work 🌟",
  "The intricate stone carvings on the temple gopuram look breathtaking!",
  "Such vivid colors and emotion! Definitely one of the top posts on the platform. ❤️"
];

async function seedIndianCommunity() {
  try {
    await mongoose.connect(`${mongoURI}/${DB_NAME}`);
    console.log("🚀 Connected to MongoDB Atlas for Indian Community Expansion");

    const defaultCreatorPassword = await bcrypt.hash("PixoraUser2026!", 10);
    const demoPasswordHash = await bcrypt.hash("Test@123", 10);

    // 1. Ensure master demo account has maximum prestige
    let demoUser = await User.findOne({ email: "demo@pixora.io" });
    if (!demoUser) {
      demoUser = new User({
        username: "pixora_demo",
        email: "demo@pixora.io",
        fullName: "Pixora Explorer (Demo)",
        password: demoPasswordHash,
        provider: "credentials",
      });
    }
    demoUser.fullName = "Pixora Explorer (Demo)";
    demoUser.badge = "trendsetter";
    demoUser.isVerified = true;
    demoUser.isPremium = true;
    demoUser.profileVisibility = "public";
    demoUser.userStatus = "online";
    await demoUser.save();

    // 2. Fetch Vitrag Shah
    const vitrag = await User.findOne({ email: "vitragshah2108@gmail.com" });

    // 3. Batch Create/Update 25+ Indian Creators
    const createdIndianUsers = [];
    const indianUserMap = {};

    for (const cData of indianCreatorsData) {
      let creator = await User.findOne({ email: cData.email });
      if (!creator) {
        creator = new User({
          ...cData,
          password: defaultCreatorPassword,
          provider: "credentials",
          profileVisibility: "public",
        });
      } else {
        Object.assign(creator, cData);
        creator.password = defaultCreatorPassword;
      }
      await creator.save();
      createdIndianUsers.push(creator);
      indianUserMap[cData.username] = creator;
    }
    console.log(`✅ ${createdIndianUsers.length} Indian Creators seeded & active.`);

    // 4. Batch Insert Indian Artworks
    const imagesToInsert = [];
    for (let i = 0; i < indianArtworksLibrary.length; i++) {
      const art = indianArtworksLibrary[i];
      const author = indianUserMap[art.creator] || demoUser;
      const exists = await Image.findOne({ title: art.title, user: author._id });
      if (!exists) {
        imagesToInsert.push({
          user: author._id,
          title: art.title,
          description: art.description,
          imageUrl: art.imageUrl,
          publicId: `pixora_india_${author.username}_${i}`,
          category: art.category,
          license: i % 2 === 0 ? "extended" : "standard",
          tags: art.tags,
          imageSize: Math.floor(Math.random() * 2500) + 3800,
          visibility: "public",
          commentsAllowed: true,
          likesCount: 0,
          favoritesCount: 0,
          commentsCount: 0,
        });
      }
    }

    if (imagesToInsert.length > 0) {
      await Image.insertMany(imagesToInsert);
      console.log(`✅ Inserted ${imagesToInsert.length} authentic Indian masterworks.`);
    }

    const allPlatformUsers = await User.find({});
    const allPlatformImages = await Image.find({});
    console.log(`📊 Platform totals: ${allPlatformUsers.length} Users, ${allPlatformImages.length} Images`);

    // 5. Interconnect Follows (All Indian creators follow demoUser and Vitrag)
    const followDocs = [];
    const existingFollows = await Follow.find({});
    const followSet = new Set(existingFollows.map(f => `${f.follower.toString()}_${f.following.toString()}`));

    for (const indianUser of createdIndianUsers) {
      // Follow demoUser & vitrag
      const priorityTargets = [demoUser, ...(vitrag ? [vitrag] : [])];
      for (const pt of priorityTargets) {
        const key = `${indianUser._id.toString()}_${pt._id.toString()}`;
        if (!followSet.has(key)) {
          followDocs.push({ follower: indianUser._id, following: pt._id });
          followSet.add(key);
        }
      }

      // Also follow 6 to 12 other Indian creators
      const peers = createdIndianUsers.filter(u => u._id.toString() !== indianUser._id.toString());
      const shuffledPeers = [...peers].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 7) + 6);
      for (const peer of shuffledPeers) {
        const key = `${indianUser._id.toString()}_${peer._id.toString()}`;
        if (!followSet.has(key)) {
          followDocs.push({ follower: indianUser._id, following: peer._id });
          followSet.add(key);
        }
      }
    }

    // DemoUser & Vitrag follow back top Indian creators
    for (const topIndian of createdIndianUsers.slice(0, 15)) {
      const keyDemo = `${demoUser._id.toString()}_${topIndian._id.toString()}`;
      if (!followSet.has(keyDemo)) {
        followDocs.push({ follower: demoUser._id, following: topIndian._id });
        followSet.add(keyDemo);
      }
      if (vitrag) {
        const keyVitrag = `${vitrag._id.toString()}_${topIndian._id.toString()}`;
        if (!followSet.has(keyVitrag)) {
          followDocs.push({ follower: vitrag._id, following: topIndian._id });
          followSet.add(keyVitrag);
        }
      }
    }

    if (followDocs.length > 0) {
      await Follow.insertMany(followDocs, { ordered: false }).catch(() => {});
      console.log(`✅ Batch inserted ${followDocs.length} new follow connections.`);
    }

    // 6. Batch Likes & Favorites on Indian Artworks and Demo posts
    const likeDocs = [];
    const favDocs = [];
    const existingLikes = await Like.find({});
    const likeSet = new Set(existingLikes.map(l => `${l.user.toString()}_${l.image.toString()}`));

    const existingFavs = await Favorite.find({});
    const favSet = new Set(existingFavs.map(f => `${f.user.toString()}_${f.image.toString()}`));

    for (const img of allPlatformImages) {
      const likers = [...allPlatformUsers].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 14) + 8);
      for (const lUser of likers) {
        const key = `${lUser._id.toString()}_${img._id.toString()}`;
        if (!likeSet.has(key)) {
          likeDocs.push({ user: lUser._id, image: img._id });
          likeSet.add(key);
        }
      }

      const favUsers = [...allPlatformUsers].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 6) + 3);
      for (const fUser of favUsers) {
        const key = `${fUser._id.toString()}_${img._id.toString()}`;
        if (!favSet.has(key)) {
          favDocs.push({ user: fUser._id, image: img._id });
          favSet.add(key);
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

    // 7. Batch Comments on Indian Posts & Vitrag/Demo Posts
    const commentDocs = [];
    for (const img of allPlatformImages) {
      const commentators = [...createdIndianUsers]
        .filter(u => u._id.toString() !== img.user.toString())
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 2);

      for (const commenter of commentators) {
        const commentText = indianCommentsPool[Math.floor(Math.random() * indianCommentsPool.length)];
        commentDocs.push({
          user: commenter._id,
          image: img._id,
          text: commentText,
        });
      }
    }
    if (commentDocs.length > 0) {
      await Comment.insertMany(commentDocs, { ordered: false }).catch(() => {});
      console.log(`✅ Batch inserted ${commentDocs.length} Indian community comments.`);
    }

    // 8. Create Flagship Indian Collections for Demo User
    const indianImages = allPlatformImages.filter(img => 
      img.tags.some(t => ['india', 'varanasi', 'tajmahal', 'jaipur', 'ladakh', 'kerala', 'mumbai', 'heritage'].includes(t))
    ).map(i => i._id);

    const indianFlagshipCollections = [
      {
        user: demoUser._id,
        name: "🇮🇳 Incredible India: Sacred Heritage & Wonders",
        description: "Curated architectural wonders, ancient ghats, palaces of Rajasthan, and sacred temples across India.",
        coverImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=85",
        visibility: "public",
        images: indianImages.slice(0, 10),
        tags: ["india", "heritage", "tajmahal", "varanasi", "rajasthan"],
        isStarred: true,
      },
      {
        user: demoUser._id,
        name: "🏔️ Himalayas & High-Altitude Horizons",
        description: "Pangong Lake, Spiti Valley monasteries, Western Ghats waterfalls and mist-covered Munnar tea hills.",
        coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
        visibility: "public",
        images: indianImages.slice(5, 15),
        tags: ["himalayas", "ladakh", "nature", "mountains", "kerala"],
        isStarred: true,
      }
    ];

    for (const ifCol of indianFlagshipCollections) {
      const exists = await Collection.findOne({ user: demoUser._id, name: ifCol.name });
      if (!exists) {
        await Collection.create(ifCol);
      }
    }

    // 9. Sync Image Counts
    for (const img of allPlatformImages) {
      const lCount = await Like.countDocuments({ image: img._id });
      const fCount = await Favorite.countDocuments({ image: img._id });
      const cCount = await Comment.countDocuments({ image: img._id });
      await Image.updateOne({ _id: img._id }, { likesCount: lCount, favoritesCount: fCount, commentsCount: cCount });
    }

    // 10. Sync User Counts & Metrics
    for (const u of allPlatformUsers) {
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

    console.log("🎉 Complete Indian community integration finished successfully!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error in seedIndianCommunity:", err);
    process.exit(1);
  }
}

seedIndianCommunity();
