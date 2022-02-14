"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const fs_1 = __importDefault(require("fs"));
fs_1.default.writeFileSync('./src/json/types.json', JSON.stringify(index_1.types, null, 4));
