const mssql = require('mssql');

module.exports = async function (context, req) {
    try {
        const { title } = req.body;

        await mssql.connect(process.env.AzureSQLConnectionString);
        console.log("Connected successfully");

        let query = `
            SELECT Films.*, AVG(Reviews.rating) AS averageRating, COUNT(Reviews.id) AS totalReviews,
                   STRING_AGG(CONCAT(Reviews.author, ': ', Reviews.opinion), ' | ') AS allReviews
            FROM Films
            LEFT JOIN Reviews ON Films.title = Reviews.title
        `;
        if (title) {
            query += `
                WHERE Films.title LIKE '%${title}%'
            `;
        }
        query += `
            GROUP BY Films.title, Films.year, Films.genre, Films.description, Films.director, Films.actors, Films.averageRating
        `;

        const result = await mssql.query(query);
        console.log("Search results:", result);

        await mssql.close();

        context.res = {
            status: 200,
            body: result.recordset
        };
    } catch (err) {
        console.error("Error connecting to the database", err);
        context.res = {
            status: 500,
            body: `${err}`
        };
        return;
    }
};