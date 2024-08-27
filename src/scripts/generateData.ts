// src/scripts/generateData.ts
// Run this script to generate exampleUsers.json
// Command: node dist/scripts/generateData.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

// Get the directory name in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateUser = (role) => {
  const uuid = uuidv4();
  const userName = `user_${uuid.slice(0, 8)}`;
  const email = `${userName}@test.com`;
  const password = "1234";

  return {
    uuid,
    userName,
    email,
    password,
    // confirmPassword: password,
    role,
    // originalRole: role,
    // skills: [],
    // resetPasswordToken: null,
    // resetPasswordExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const users = [];
for (let i = 0; i < 10; i++) {
  users.push(generateUser("mentor"));
  users.push(generateUser("mentee"));
}

const filePath = path.resolve(__dirname, "exampleUsers.json"); // Specify the path to store the JSON file in the scripts directory

fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
console.log("✅ Example users JSON file created successfully at", filePath);
