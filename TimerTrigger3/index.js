const mssql = require('mssql');

module.exports = async function (context, myTimer) {
    if (myTimer.IsPastDue) {
        context.log('Function is running late!');
    }

    try {
       
        await mssql.connect(process.env.AzureSQLConnectionString);
        console.log("Connected successfully");

        const query = `
            UPDATE Films
            SET averageRating = (
                SELECT AVG(rating) AS avgRating
                FROM Reviews
                WHERE Reviews.title = Films.title
            );
        `;

        const result = await mssql.query(query);
        console.log("Average ratings calculated and updated successfully:", result);

        await mssql.close();
    } catch (err) {
        console.error("Error connecting to the database", err);
        context.done(err);
        return;
    }

    context.done();
};