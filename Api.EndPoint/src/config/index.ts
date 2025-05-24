export const config = {
    baseUrl: process.env.BASE_URL || 'https://example.com',
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',
    database: {
        url: process.env.DATABASE_URL || 'mongodb://localhost:27017/news',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: 'json'
    }
}; 