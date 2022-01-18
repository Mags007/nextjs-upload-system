"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlstring_1 = __importDefault(require("sqlstring"));
const mysql_1 = require("./mysql");
class ShortSQL {
    connection;
    constructor(connection) {
        this.connection = connection;
        this.init();
    }
    init() {
        const query = 'CREATE TABLE IF NOT EXISTS `shorter` (`name` varchar(50) NOT NULL,`url` text NOT NULL,PRIMARY KEY (`name`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;';
        this.connection.query(query);
        return;
    }
    selectShortedURL(shortedLink) {
        return new Promise((resolve, reject) => {
            this.connection.query(sqlstring_1.default.format('SELECT * FROM shorter WHERE name = ?', [
                shortedLink,
            ]), (error, results, fields) => {
                if (error) {
                    reject(error);
                    return mysql_1.connection.handleError(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    selectAllShortedURLs() {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM shorter', (error, results, fields) => {
                if (error) {
                    reject(error);
                    return mysql_1.connection.handleError(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    deleteShortURL(shortLink) {
        return new Promise((resolve, reject) => {
            this.connection.query(sqlstring_1.default.format('DELETE FROM shorter WHERE name = ?', [shortLink]), (error, results, fields) => {
                if (error) {
                    reject(error);
                    return mysql_1.connection.handleError(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    createNewShortURL(shortLink, url) {
        return new Promise((resolve, reject) => {
            this.connection.query(sqlstring_1.default.format('INSERT INTO shorter (name, url) VALUES (?, ?)', [
                shortLink,
                url,
            ]), (error, results, fields) => {
                if (error) {
                    reject(error);
                    return mysql_1.connection.handleError(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
}
exports.default = ShortSQL;