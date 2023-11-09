import Fastify from "fastify";
import cors from "@fastify/cors";

const intervals = ["daily", "monthly", "yearly"] as const;
type Interval = (typeof intervals)[number];
type ReportQuery = {
    start: number;
    end: number;
    interval: Interval;
};
type Point = {
    amount: number;
    date: number;
};

const app = Fastify({
    logger: true,
});

app.register(cors);
app.register(
    async (fastify) => {
        fastify.get<{ Querystring: ReportQuery }>(
            "/report",
            {
                schema: {
                    querystring: {
                        type: "object",
                        required: ["start", "end", "interval"],
                        properties: {
                            start: { type: "number" },
                            end: { type: "number" },
                            interval: {
                                type: "string",
                                enum: ["daily", "monthly", "yearly"],
                                default: "daily",
                            },
                        },
                    },
                },
            },
            async (req) => {
                return generateFakeData(req.query);
            },
        );
    },
    { prefix: "/api" },
);

app.listen({ port: 5002 });

const ONE_DAY = 1000 * 60 * 60 * 24;
const ONE_MONTH = ONE_DAY * 30;
const ONE_YEAR = ONE_DAY * 265;

function generateFakeData(query: ReportQuery) {
    let intervalSep = ONE_DAY;
    let factor = 100;
    switch (query.interval) {
        case "daily":
            intervalSep = ONE_DAY;
            factor = 100;
            break;
        case "monthly":
            intervalSep = ONE_MONTH;
            factor = 3000;
            break;
        case "yearly":
            intervalSep = ONE_YEAR;
            factor = 12000;
            break;
    }
    let total = 0;
    const graph: Point[] = [];
    for (let date = query.start; date <= query.end; date += intervalSep) {
        const amount = Math.round(Math.random() * factor);
        total += amount;
        graph.push({
            amount,
            date,
        });
    }
    return { graph, total };
}
