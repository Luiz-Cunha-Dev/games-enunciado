import app from "app";
import supertest from "supertest";
import prisma from "config/database";
import { createGame } from "./factories/games-factory";
import { createConsole } from "./factories/consoles-factory";

const api = supertest(app);

beforeAll(async () => {
    await prisma.game.deleteMany({})
    await prisma.console.deleteMany({})
})

afterEach(async () => {
    await prisma.game.deleteMany({})
    await prisma.console.deleteMany({})
})


describe("GET /games", () => {

    it('should respond with status 200', async () => {
        const result = await api.get("/games")
        expect(result.status).toBe(200)
    });

})

describe("GET /games/:id", () => {

    it('should respond with status 404', async () => {
        const result = await api.get("/games/0")
        expect(result.status).toBe(404)
    });

    it('should respond with status 200', async () => {
        const consoleCreated = await createConsole();

        const game  = await createGame(consoleCreated.id);
        

        const result = await api.get(`/games/${game.id}`)
        expect(result.status).toBe(200)
    });

})

describe("POST /games", () => {

    it('should respond with status 201', async () => {
        const consoleCreated = await createConsole();
        const result = await api.post("/games").send({title: "mario", consoleId: consoleCreated.id});
        expect(result.status).toBe(201)
    });

    it('should respond with status 409', async () => {
        const console = await createConsole();
        await api.post("/games").send({title: "super mario", consoleId: console.id})
        const result = await api.post("/games").send({title: "super mario", consoleId: console.id})
        expect(result.status).toBe(409)
    });

    it('should respond with status 422', async () => {
        const result = await api.post("/games").send({})
        expect(result.status).toBe(422)
    });

})