import app from "app";
import supertest from "supertest";
import prisma from "config/database";
import { createConsole } from "./factories/consoles-factory";

const api = supertest(app);

beforeAll(async () => {
    await prisma.console.deleteMany({})
    await prisma.game.deleteMany({})
})

afterEach(async () => {
    await prisma.console.deleteMany({})
    await prisma.game.deleteMany({})
})


describe("GET /consoles", () => {


    it('should respond with status 200', async () => {
        const result = await api.get("/consoles")
        expect(result.status).toBe(200)
    });

})

describe("GET /consoles/:id", () => {

    it('should respond with status 404', async () => {
        const result = await api.get("/consoles/0")
        expect(result.status).toBe(404)
    });

    it('should respond with status 200', async () => {
        const console  = await createConsole();

        const result = await api.get(`/consoles/${console.id}`)
        expect(result.status).toBe(200)
    });

})

describe("POST /consoles", () => {


    it('should respond with status 201', async () => {
        const result = await api.post("/consoles").send({name: "playstation 1"})
        expect(result.status).toBe(201)
    });

    it('should respond with status 409', async () => {
        await api.post("/consoles").send({name: "playstation 1"})
        const result = await api.post("/consoles").send({name: "playstation 1"})
        expect(result.status).toBe(409)
    });

    it('should respond with status 422', async () => {
        const result = await api.post("/consoles").send({})
        expect(result.status).toBe(422)
    });

})