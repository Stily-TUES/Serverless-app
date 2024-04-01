const mssql = require('mssql');

module.exports = async function (context, req) {
    try {
        const { title, opinion, rating, author } = req.body;

        await mssql.connect(process.env.AzureSQLConnectionString);
        console.log("Connected successfully");

        const query = `
            INSERT INTO Reviews (title, opinion, rating, dateTime, author)
            VALUES (@title, @opinion, @rating, GETDATE(), @author);
        `;

        const request = new mssql.Request();
        request.input('title', mssql.NVarChar, title);
        request.input('opinion', mssql.NVarChar, opinion);
        request.input('rating', mssql.Int, rating);
        request.input('author', mssql.NVarChar, author);

        const result = await request.query(query);
        console.log("Review information inserted successfully:", result);

        await mssql.close();
    } catch (err) {
        console.error("Error connecting to the database", err);
        context.res = {
            status: 500,
            body: "An error occurred while processing the request."
        };
        return;
    }

    context.res = {
        status: 200,
        body: "Review information has been successfully saved."
    };
};