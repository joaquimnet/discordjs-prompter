"use strict";
/**
 * The Prompter object
 */
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = require("./message");
const reaction_1 = require("./reaction");
const vote_1 = require("./vote");
const choice_1 = require("./choice");
/**
 * Main Prompter object
 */
const Prompter = {
    /**
     * The message function
     * See [[message]]
     */
    message: message_1.message,
    /**
     * The reaction function
     * See [[reaction]]
     */
    reaction: reaction_1.reaction,
    /**
     * The vote function
     * See [[vote]]
     */
    vote: vote_1.vote,
    /**
     * The choice function
     * See [[choice]]
     */
    choice: choice_1.choice,
};
exports.default = Prompter;
module.exports = Prompter;
