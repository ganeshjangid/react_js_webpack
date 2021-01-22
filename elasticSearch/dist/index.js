"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var bodyParser = require("express");
var elasticSearch = require("elasticsearch");
var app = express_1.default();
var PORT = 5050;
var esClient = elasticSearch.Client({
    host: "http://127.0.0.1:9200",
});
app.use(bodyParser.json());
app.post("/Product", function (req, res) {
    esClient
        .index({
        index: "products",
        body: {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
        },
    })
        .then(function () {
        return res.json({ message: "Indexing successful" });
    })
        .catch(function (err) {
        return res.status(500).json({ message: "Error" });
    });
});
app.get("/products", function (req, res) {
    var searchText = req.query.text;
    esClient
        .search({
        index: "products",
        body: {
            query: {
                match: { name: searchText },
            },
        },
    })
        .then(function (response) {
        return res.json(response);
    })
        .catch(function (err) {
        return res.status(500).json({ message: "Error" + err });
    });
});
app.listen(PORT, function () {
    return console.log("Node server is running on PORT No. " + PORT);
});
