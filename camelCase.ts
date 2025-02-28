import fs from "fs";
import path from "path";
import { PATHS } from "./paths";

function main() {
  const sourceDir = `${PATHS.SOURCE}/camelCase`;
  const targetDir = `${PATHS.TARGET}/camelCase`;

  const files = fs.readdirSync(sourceDir);

  files.forEach((file) => {
    if (path.extname(file) === ".json") {
      const jsonPath = path.join(sourceDir, file);

      if (!fs.existsSync(jsonPath)) {
        console.log("JSON file does not exist");
        process.exit(1);
      }
      const obj = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

      const camelCasedObj = camelCaseifyMongoObjectKeys(obj);

      const targetFilePath = path.join(targetDir, file);
      fs.writeFileSync(targetFilePath, JSON.stringify(camelCasedObj, null, 2));
    }
  });
}

function camelCaseifyMongoObjectKeys(obj: object): object {
  if (Array.isArray(obj)) {
    return obj.map(camelCaseifyMongoObjectKeys);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        let newValue;
        let newKey = key;

        if (key === "_id" || key === "$oid") {
          newKey = "mongoId";
        } else if (key === "__v") {
          newKey = key;
        } else if (key === "data") {
          newKey = "metadata";
        } else {
          newKey = snakeCaseToCamelCase(key);
        }

        if (value === null || value === undefined) {
          return [newKey, value];
        } else if (
          Array.isArray(value) &&
          value.every((item) => typeof item === "object" && "$oid" in item)
        ) {
          newValue = value.map((item) => item.$oid);
        } else if (Array.isArray(value)) {
          newValue = value.map(camelCaseifyMongoObjectKeys);
        } else if (typeof value === "object" && "$oid" in value) {
          newValue = value.$oid;
        } else if (
          typeof value === "object" &&
          value !== null &&
          "$date" in value
        ) {
          newValue = value.$date;
        } else if (key === "_id" && typeof value !== "string") {
          newValue = value.$oid;
        } else {
          newValue = camelCaseifyMongoObjectKeys(value);
        }
        return [newKey, newValue];
      })
    );
  } else {
    return obj;
  }
}

function snakeCaseToCamelCase(str: string) {
  return str.replace(/([-_][a-z0-9])/gi, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
}

main();
