// https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial

import * as mongoDB from "mongodb";
import {
  DB_CONN_STRING,
  DB_NAME,
  JOBS_COLLECTION_NAME,
  SKILLS_COLLECTION_NAME,
  STATISTICS_COLLECTION_NAME,
  USERS_COLLECTION_NAME,
} from "../constants/constants";
import Job from "../models/job";
import Skill from "../models/skill";
import Statistics from "../models/statistics";
import User from "../models/user";

class DatabaseService {
  private static instance: DatabaseService;
  public collections: {
    jobs?: mongoDB.Collection<Job>;
    skills?: mongoDB.Collection<Skill>;
    users?: mongoDB.Collection<User>;
    statistics?: mongoDB.Collection<Statistics>;
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
    const client = new mongoDB.MongoClient(DB_CONN_STRING);

    await client.connect();
    const db = client.db(DB_NAME);

    // setup schema validation
    // await this.applySchemaValidation(db);

    this.collections.jobs = db.collection<Job>(JOBS_COLLECTION_NAME);
    this.collections.skills = db.collection<Skill>(SKILLS_COLLECTION_NAME);
    this.collections.users = db.collection<User>(USERS_COLLECTION_NAME);
    this.collections.statistics = db.collection<Statistics>(
      STATISTICS_COLLECTION_NAME
    );

    console.log(`Successfully connected to database: ${db.databaseName}`);
    console.log(`collection: ${this.collections.jobs.collectionName}`);
    console.log(`collection: ${this.collections.skills.collectionName}`);
    console.log(`collection: ${this.collections.users.collectionName}`);
    console.log(`collection: ${this.collections.statistics.collectionName}`);
  }
}

export default DatabaseService;
