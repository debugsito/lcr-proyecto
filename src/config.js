export default {
    redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || "6379",
        password: process.env.REDIS_PASSWORD || undefined
    },
    dynamodb: {
        region: process.env.AWS_REGION || "us-east-2"
    }
};
