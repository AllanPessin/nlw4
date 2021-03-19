import request from 'supertest';
import { app } from '../app';
import createConnection from '../database';

describe("Surveys", () => { 
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  })

  it("Should be able to create a new surey", async () => {
    const response = await request(app).post("/surveys")
      .send({
        title: "title example",
        description: "description example"
    })

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  })

  it("should able to get all surveys", async () => {
    await request(app).post("/surveys")
    .send({
      title: "Another example",
      description: "another description",
    })

    const response = await request(app).get("/surveys");

    expect(response.body.length).toBe(2);
  })
})
