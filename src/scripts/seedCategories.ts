import { db } from "@/db";
import { categories } from "@/db/schema";

const categoriesNames = [
  "Cars & Vehicles",
  "Comedy",
  "Education",
  "Gaming",
  "Entertainment",
  "Film & Animation",
  "How-to and Style",
  "Music",
  "News & Politics",
  "People & Blogs",
  "Pets & Animals",
  "Science & Technology",
  "Sports",
  "Travel & Events",
];

async function main() {
  try {
    const values = categoriesNames.map((name) => ({
      name,
      description: `Videos related to ${name.toLowerCase()}`,
    }));
    await db.insert(categories).values(values);
    console.log("Categories seeded successfully");
  } catch (error) {
    console.log("Error seeding categories", error);
    process.exit(1);
  }
}

main();
