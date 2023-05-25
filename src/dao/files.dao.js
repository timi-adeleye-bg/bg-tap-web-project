// import required modules
const pool = require("../database/dbConfig");
const fs = require("fs");
const csv = require("csv-parser");
const { error } = require("console");

//import countries
const uploadCountry = () => {
  const results = [];

  fs.createReadStream("./src/files/country.csv")
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      console.log("Country CSV file processed successfully");

      try {
        for (const row of results) {
          const query = {
            text: `INSERT INTO Nationality(country) VALUES($1)`,
            values: [row.country],
          };

          await pool.query(query);
          console.log("Data Inserted Successfully");
        }
      } catch (error) {
        console.error(error);
      }
    });
};

console.log(uploadCountry());

//import states
const uploadState = () => {
  const results = [];

  fs.createReadStream("./src/files/state.csv")
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      console.log("State CSV file processed successfully");

      try {
        for (const row of results) {
          const query = {
            text: `INSERT INTO State(name, country_id) VALUES($1, $2)`,
            values: [row.state, row.country_id],
          };

          await pool.query(query);
          console.log("Data Inserted Successfully");
        }
      } catch (error) {
        console.error(error);
      }
    });
};

console.log(uploadState());

//import Local Government areas
const uploadlGA = () => {
  const results = [];

  fs.createReadStream("./src/files/lGA.csv")
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      console.log("LGA CSV file processed successfully");

      try {
        for (const row of results) {
          const query = {
            text: `INSERT INTO LGA(name, state_id) VALUES($1, $2)`,
            values: [row.name, row.state_id],
          };

          await pool.query(query);
          console.log("Data Inserted Successfully");
        }
      } catch (error) {
        console.error(error);
      }
    });
};

console.log(uploadlGA());

//import Products
const uploadProduct = () => {
  const results = [];

  fs.createReadStream("./src/files/products.csv")
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      console.log("Product CSV file processed successfully");

      try {
        for (const row of results) {
          const query = {
            text: `INSERT INTO Products(name) VALUES($1)`,
            values: [row.name],
          };

          await pool.query(query);
          console.log("Data Inserted Successfully");
        }
      } catch (error) {
        console.error(error);
      }
    });
};

console.log(uploadProduct());

//import Products
const uploadSeed = () => {
  const results = [];

  fs.createReadStream("./src/files/seed.csv")
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      console.log("Seed CSV file processed successfully");

      try {
        for (const row of results) {
          const query = {
            text: `INSERT INTO Seed(name, product_id) VALUES($1, $2)`,
            values: [row.name, row.product_id],
          };

          await pool.query(query);
          console.log("Data Inserted Successfully");
        }
      } catch (error) {
        console.error(error);
      }
    });
};

console.log(uploadSeed());

//import hub files
const uploadHub = () => {
  const results = [];

  fs.createReadStream("./src/files/hub.csv")
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      console.log("CSV file processed successfully");

      try {
        for (const row of results) {
          const query = {
            text: "INSERT INTO hub(name, state_id) VALUES($1, $2)",
            values: [row.name, row.state_id],
          };

          await pool.query(query);
          console.log("Data Inserted Successfully");
        }
      } catch (error) {
        console.error(error);
      }
    });
};

console.log(uploadHub());

//import question files
const uploadQuestion = () => {
  const results = [];

  fs.createReadStream("./src/files/questions.csv")
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      console.log("CSV file processed successfully");

      try {
        for (const row of results) {
          const query = {
            text: "INSERT INTO questions(question, category, answer, options) VALUES($1, $2, $3, $4)",
            values: [row.question, row.category, row.answer, row.options],
          };

          await pool.query(query);
          console.log("Data Inserted Successfully");
        }
      } catch (error) {
        console.error(error);
      }
    });
};

console.log(uploadQuestion());
