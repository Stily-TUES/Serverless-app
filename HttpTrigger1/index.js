const mssql = require('mssql');

module.exports = async function (context, req) {
    try {
        // Parse request body for film information
        const { title, year, genre, description, director, actors } = req.body;

        // Connect to the Azure SQL Database
        await mssql.connect(process.env.AzureSQLConnectionString);
        console.log("Connected successfully");

        // SQL query to insert film information into the Films table
        const query = `
            INSERT INTO Films (title, year, genre, description, director, actors)
            VALUES (@title, @year, @genre, @description, @director, @actors);
        `;

        // Prepare the request
        const request = new mssql.Request();
        request.input('title', mssql.NVarChar, title);
        request.input('year', mssql.NVarChar, year);
        request.input('genre', mssql.NVarChar, genre);
        request.input('description', mssql.NVarChar, description);
        request.input('director', mssql.NVarChar, director);
        request.input('actors', mssql.NVarChar, actors);

        // Execute the query
        const result = await request.query(query);
        console.log("Film information inserted successfully:", result);

        // Close the database connection
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
        body: "Film information has been successfully saved."
    };
};