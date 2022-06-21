// https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial

import * as mongoDB from "mongodb";
import Job from "../models/job";
import Skill from "../models/skill";

class DatabaseService {
  private static instance: DatabaseService;
  public collections: {
    jobs?: mongoDB.Collection<Job>;
    skills?: mongoDB.Collection<Skill>;
  } = {};

  private constructor() {}

  // https://refactoring.guru/design-patterns/singleton/typescript/example
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async connectToDatabase() {
    const client = new mongoDB.MongoClient(process.env.DB_CONN_STRING!);

    await client.connect();
    const db = client.db(process.env.DB_NAME);

    // setup schema validation
    // await this.applySchemaValidation(db);

    this.collections.jobs = db.collection<Job>(
      process.env.JOBS_COLLECTION_NAME!
    );
    this.collections.skills = db.collection<Skill>(
      process.env.SKILLS_COLLECTION_NAME!
    );

    console.log(`Successfully connected to database: ${db.databaseName}`);
    console.log(`collection: ${this.collections.jobs.collectionName}`);
    console.log(`collection: ${this.collections.skills.collectionName}`);
  }
}

export default DatabaseService;
