"use server";

import { redirect } from "next/navigation";
import prisma from "@/app/lib/client";

export async function createCourse(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const difficulty = formData.get("difficulty") as string;
  const thumbnail_url = formData.get("thumbnail_url") as string;
  const creator = formData.get("creator") as string;

  if (!name || !description || !difficulty || !thumbnail_url || !creator) {
    throw new Error("All fields are required");
  }

  await prisma.course.create({
    data: {
      name,
      description,
      difficulty,
      thumbnail_url,
      creator,
    },
  });

  redirect("/");
}