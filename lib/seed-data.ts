import { Db, ObjectId } from "mongodb";
import { Course, User } from "@/models";
import seedrandom from "seedrandom";
import { faker } from "@faker-js/faker";
import { createRecommendation } from "./create-recommendation";

const SEED = "engagement-tracker-2024";
const rng = seedrandom(SEED);

const NUM_USERS = 50;
const NUM_COURSES = 20;
const NUM_ENGAGEMENTS = 1000;

const courseTitles = [
  "Introduction to Tableau",
  "The Complete Data Visualization Course with Python, R, Tableau, and Excel",
  "Introduction to R Programming",
  "Data Preprocessing with NumPy",
  "Introduction to Data and Data Science",
  "Data Cleaning and Preprocessing with pandas",
  "Introduction to Business Analytics",
  "Data Analysis with Excel Pivot Tables",
  "SQL",
  "Credit Risk Modeling in Python",
  "Python Programmer Bootcamp",
  "SQL + Tableau + Python",
  "Introduction to Jupyter",
  "Statistics",
  "Mathematics",
  "Introduction to Excel",
  "Probability",
  "Starting a Career in Data Science: Project Portfolio, Resume, and Interview Process",
  "SQL + Tableau",
  "Time Series Analysis with Python",
  "Power BI",
  "Product Management for AI & Data Science",
  "Git and GitHub",
  "Deep Learning with TensorFlow 2",
  "Customer Analytics in Python",
  "Web Scraping and API Fundamentals in Python",
  "Introduction to Python",
  "Python for Finance",
  "Machine Learning in Python",
  "Advanced Microsoft Excel",
  "Convolutional Neural Networks with TensorFlow in Python",
  "Data Strategy",
  "Fashion Analytics with Tableau",
  "Dates and Times in Python",
  "SQL for Data Science Interviews",
  "Data Literacy",
  "AI Applications for Business Success",
  "Linear Algebra and Feature Selection",
  "Machine Learning with Naïve Bayes",
  "Machine Learning in Excel",
  "Machine Learning with Support Vector Machines",
  "A/B Testing in Python",
  "Machine Learning with Decision Trees and Random Forests",
  "Machine Learning with K-Nearest Neighbors",
  "Machine Learning with Ridge and Lasso Regression",
  "Data-Driven Business Growth",
];
const difficulties = ["easy", "medium", "hard"] as const;

function generateUsers(num: number): User[] {
  return Array.from({ length: num }, (_, i) => ({
    _id: new ObjectId(),
    name: rng() < 0.85 ? faker.person.fullName() : (null as any),
  }));
}

function generateCourses(num: number): Course[] {
  return Array.from({ length: num }, (_, i) => ({
    _id: new ObjectId(),
    title: courseTitles[Math.floor(rng() * courseTitles.length)],
    difficulty: difficulties[Math.floor(rng() * difficulties.length)],
  }));
}

function generateEngagement(user: User, course: Course) {
  return {
    _id: new ObjectId(),
    userId: user._id.toHexString(),
    courseId: course._id.toHexString(),
    timestamp: new Date().toISOString(),
    timeSpent: Math.floor(rng() * 1000 * 10),
  };
}

export async function generateSeedData(db: Db) {
  await db.collection("users").drop();
  await db.collection("courses").drop();
  await db.collection("engagements").drop();
  await db.collection("recommendations").drop();

  const users = generateUsers(NUM_USERS);
  const courses = generateCourses(NUM_COURSES);

  console.log("Generating seed data...");
  await db.collection("users").insertMany(users);
  await db.collection("courses").insertMany(courses);

  const engagements = [];
  for (let i = 0; i < NUM_ENGAGEMENTS; i++) {
    const user = users[Math.floor(rng() * users.length)];
    const course = courses[Math.floor(rng() * courses.length)];

    if (i % 7 === 0) {
      await createRecommendation(user._id.toHexString(), db);
    }
    const engagement = generateEngagement(user, course);
    engagements.push(engagement);
    if (i % 100 === 0) {
      console.log(`Progress: ${i}/${NUM_ENGAGEMENTS}`);
    }
  }
  await db.collection("engagements").insertMany(engagements);

  console.log("Seed data generation complete!");
}
