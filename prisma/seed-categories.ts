import prisma from "./client";

async function main() {
  // Create default categories
  const categories = [
    { name: "Programming", description: "Learn programming languages and concepts" },
    { name: "Web Development", description: "Build websites and web applications" },
    { name: "Data Science", description: "Analyze data and build machine learning models" },
    { name: "Mobile Development", description: "Create mobile apps for iOS and Android" },
    { name: "DevOps", description: "Learn deployment, CI/CD, and infrastructure" },
    { name: "Design", description: "UI/UX design and graphic design principles" },
    { name: "Business", description: "Business skills and entrepreneurship" },
    { name: "Marketing", description: "Digital marketing and growth strategies" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: category,
      create: category,
    });
  }

  console.log("Categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });