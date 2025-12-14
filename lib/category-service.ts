import prisma from "@/prisma/client";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}