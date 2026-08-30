import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

import { User } from '../src/models/user.model.js';
import { Image } from '../src/models/image.model.js';
import { Like } from '../src/models/like.model.js';
import { Favorite } from '../src/models/favorite.model.js';
import { Comment } from '../src/models/comment.model.js';
import { Collection } from '../src/models/collection.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const DB_NAME = "image_sharing_platform";
const mongoURI = process.env.MONGO_URI;

const demoUserPostsData = [
  {
    title: "Chroma Neon Dystopia: Shinjuku Alleyway",
    description: "Rain-drenched neon alleys glowing in vibrant magenta, electric turquoise, and deep amber reflections on Tokyo asphalt.",
    imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_user_post_1",
    category: "cyberpunk",
    license: "extended",
    tags: ["cyberpunk", "neon", "tokyo", "scifi", "night", "cityscape", "japan"],
    imageSize: 4620,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Pangong Lake Sunrise: Azure Reflections",
    description: "High-altitude tranquil azure waters of Pangong Tso nestled at 14,000 ft between dramatic barren Himalayan passes in Ladakh.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_user_post_2",
    category: "landscape",
    license: "standard",
    tags: ["ladakh", "pangong", "mountains", "himalayas", "sunrise", "landscape"],
    imageSize: 5240,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Prism Caustics: Liquid Glass 3D Refraction",
    description: "Mesmerizing 3D procedural simulation of a twisted chromatic glass sculpture casting rainbow caustics across obsidian.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_user_post_3",
    category: "abstract",
    license: "extended",
    tags: ["abstract", "3d", "glass", "chromatic", "refraction", "render"],
    imageSize: 4890,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "The Golden Temple at Blue Hour",
    description: "Harmandir Sahib illuminated in sacred golden brilliance reflecting seamlessly across the holy Amrit Sarovar at twilight.",
    imageUrl: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_user_post_4",
    category: "other",
    license: "standard",
    tags: ["goldentemple", "amritsar", "spiritual", "peace", "heritage", "india"],
    imageSize: 5100,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Cyberpunk Sea Link: Mumbai Midnight Glow",
    description: "Long exposure cable-stayed Bandra-Worli Sea Link bathed in futuristic cyan and violet lights over the Arabian Sea.",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_user_post_5",
    category: "cyberpunk",
    license: "extended",
    tags: ["mumbai", "sealink", "cyberpunk", "night", "longexposure", "cityscape"],
    imageSize: 4430,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Hawa Mahal Honeycomb Symmetry: The Pink City",
    description: "Intricate pink sandstone jharokhas and latticed facade of Jaipur's Palace of Winds catching golden sunset light.",
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_user_post_6",
    category: "minimal",
    license: "standard",
    tags: ["jaipur", "hawamahal", "rajasthan", "architecture", "heritage", "minimal"],
    imageSize: 3950,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Editorial Noir: Dual Tone High-Fashion Gaze",
    description: "Striking studio portrait featuring cinematic crimson and sapphire gel lighting accentuating intense expressive eyes.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_user_post_7",
    category: "portrait",
    license: "extended",
    tags: ["portrait", "editorial", "fashion", "cinematic", "lighting", "model"],
    imageSize: 4180,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Spacewalk Over Andromeda: Cosmic Horizons",
    description: "Solitary astronaut floating weightlessly in low planetary orbit with the glowing spiral core of the Andromeda galaxy.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_user_post_8",
    category: "other",
    license: "extended",
    tags: ["space", "astronaut", "cosmos", "galaxy", "stars", "universe", "scifi"],
    imageSize: 5800,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Brutalist Shadowplay: Geometric Concrete Solitude",
    description: "Minimalist monolithic cantilevered raw concrete structures creating sharp angular shadow cuts against the sky.",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_user_post_9",
    category: "minimal",
    license: "standard",
    tags: ["minimal", "architecture", "brutalist", "shadows", "lines", "concrete"],
    imageSize: 3750,
    visibility: "public",
    commentsAllowed: true,
  },
  {
    title: "Misty Tea Plantations of Munnar: Emerald Horizons",
    description: "Endless rolling green tea terraces shrouded in morning fog in the Western Ghats of Kerala.",
    imageUrl: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1200&q=85",
    publicId: "pixora_demo_user_post_10",
    category: "landscape",
    license: "standard",
    tags: ["kerala", "munnar", "tea", "greenery", "nature", "hills", "mist"],
    imageSize: 4920,
    visibility: "public",
    commentsAllowed: true,
  }
];

const sampleFeedbackComments = [
  "The color grading and composition on this are breathtaking! 🔥",
  "Saved straight to my inspiration collection! Incredible work ✨",
  "The lighting contrast is so clean. What camera/tools did you use?",
  "Pure visual perfection. Love the mood and tones! 👏",
  "One of my favorite uploads on Pixora! Outstanding shot! 🌟",
  "The reflections and textures look super crisp. Brilliant work! 💎"
];

async function seedDemoPosts() {
  try {
    await mongoose.connect(`${mongoURI}/${DB_NAME}`);
    console.log("🚀 Connected to MongoDB Atlas");

    const demoUser = await User.findOne({ email: "demo@pixora.io" });
    if (!demoUser) {
      console.error("Demo user not found!");
      process.exit(1);
    }

    const allOtherUsers = await User.find({ _id: { $ne: demoUser._id } });

    // 1. Insert new posts for demoUser
    const insertedImages = [];
    for (const postData of demoUserPostsData) {
      const existing = await Image.findOne({ title: postData.title, user: demoUser._id });
      if (!existing) {
        const newImg = new Image({
          user: demoUser._id,
          ...postData,
          likesCount: 0,
          favoritesCount: 0,
          commentsCount: 0,
        });
        await newImg.save();
        insertedImages.push(newImg);
      } else {
        insertedImages.push(existing);
      }
    }
    console.log(`✅ Seeded ${insertedImages.length} showcase posts for demo user (${demoUser.username})`);

    // 2. Add likes, favorites, and comments on each of demoUser's posts from other community creators
    const likeDocs = [];
    const favDocs = [];
    const commentDocs = [];

    const existingLikes = await Like.find({ image: { $in: insertedImages.map(i => i._id) } });
    const likeSet = new Set(existingLikes.map(l => `${l.user.toString()}_${l.image.toString()}`));

    const existingFavs = await Favorite.find({ image: { $in: insertedImages.map(i => i._id) } });
    const favSet = new Set(existingFavs.map(f => `${f.user.toString()}_${f.image.toString()}`));

    for (const img of insertedImages) {
      // 12 to 24 likes per demo post
      const shuffledUsers = [...allOtherUsers].sort(() => 0.5 - Math.random());
      const likers = shuffledUsers.slice(0, Math.floor(Math.random() * 12) + 12);
      for (const lUser of likers) {
        const key = `${lUser._id.toString()}_${img._id.toString()}`;
        if (!likeSet.has(key)) {
          likeDocs.push({ user: lUser._id, image: img._id });
          likeSet.add(key);
        }
      }

      // 4 to 10 favorites per demo post
      const favUsers = shuffledUsers.slice(0, Math.floor(Math.random() * 6) + 4);
      for (const fUser of favUsers) {
        const key = `${fUser._id.toString()}_${img._id.toString()}`;
        if (!favSet.has(key)) {
          favDocs.push({ user: fUser._id, image: img._id });
          favSet.add(key);
        }
      }

      // 2 to 4 comments per demo post
      const commentators = shuffledUsers.slice(0, Math.floor(Math.random() * 3) + 2);
      for (const cUser of commentators) {
        const commentText = sampleFeedbackComments[Math.floor(Math.random() * sampleFeedbackComments.length)];
        commentDocs.push({
          user: cUser._id,
          image: img._id,
          text: commentText,
        });
      }
    }

    if (likeDocs.length > 0) {
      await Like.insertMany(likeDocs, { ordered: false }).catch(() => {});
    }
    if (favDocs.length > 0) {
      await Favorite.insertMany(favDocs, { ordered: false }).catch(() => {});
    }
    if (commentDocs.length > 0) {
      await Comment.insertMany(commentDocs, { ordered: false }).catch(() => {});
    }
    console.log(`✅ Added ${likeDocs.length} likes, ${favDocs.length} favorites, and ${commentDocs.length} comments to demo posts.`);

    // 3. Update Collections on Demo account to include its own new images
    const userAllImages = await Image.find({ user: demoUser._id });
    const userImageIds = userAllImages.map(i => i._id);

    await Collection.updateMany(
      { user: demoUser._id },
      { $addToSet: { images: { $each: userImageIds.slice(0, 6) } } }
    );

    // 4. Sync image counts for demo posts
    for (const img of insertedImages) {
      const lCount = await Like.countDocuments({ image: img._id });
      const fCount = await Favorite.countDocuments({ image: img._id });
      const cCount = await Comment.countDocuments({ image: img._id });
      await Image.updateOne({ _id: img._id }, { likesCount: lCount, favoritesCount: fCount, commentsCount: cCount });
    }

    // 5. Sync Demo User stats
    const totalLikes = (await Image.find({ user: demoUser._id })).reduce((sum, i) => sum + (i.likesCount || 0), 0);
    const totalStorage = (await Image.find({ user: demoUser._id })).reduce((sum, i) => sum + (i.imageSize || 4000), 0);

    demoUser.postsCount = userAllImages.length;
    demoUser.likesCount = totalLikes;
    demoUser.storageUsed = totalStorage;
    demoUser.badge = "trendsetter";
    await demoUser.save();

    console.log("🎉 Demo user posts & profile synced successfully!");
    console.log({
      username: demoUser.username,
      email: demoUser.email,
      postsCount: demoUser.postsCount,
      likesReceived: demoUser.likesCount,
      followers: demoUser.followersCount,
      badge: demoUser.badge,
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding demo posts:", err);
    process.exit(1);
  }
}

seedDemoPosts();
