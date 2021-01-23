import Express, { Request, Response } from "express";
const bodyParser = require("express");
const elasticSearch = require("elasticsearch");
const app = Express();
const PORT = 5050;

const esClient = elasticSearch.Client({
  host: "http://127.0.0.1:9200",
});

app.use(bodyParser.json());

app.post("/Product", (req: Request, res: Response) => {
  esClient
    .index({
      index: "products",
      body: {
        id: req.body.id,
        name: req.body.name,
        price: req.body.price,
      },
    })
    .then(() => {
      return res.json({ message: "Indexing successful" });
    })
    .catch((err: any) => {
      return res.status(500).json({ message: "Error" });
    });
});

app.get("/products", (req: Request, res: Response) => {
  const searchText = req.query.text;
  esClient
    .search({
      index: "products",
      body: {
        query: {
          match: { name: searchText },
        },
      },
    })
    .then((response: any) => {
      return res.json(response);
    })
    .catch((err: any) => {
      return res.status(500).json({ message: "Error" + err });
    });
});

app.listen(PORT, () =>
  console.log(`Node server is running on PORT No. ${PORT}`)
);
