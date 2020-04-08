import { Collection, DMChannel, Emoji, EmojiIdentifierResolvable, Message, ReactionEmoji, TextChannel } from 'discord.js';

declare const Prompter: {
	/**
	 * The message function
	 * See [[message]]
	 */
	message: (channel: import("discord.js").TextChannel | import("discord.js").DMChannel, options: {
		question: string;
		prefix?: string | undefined;
		userId?: string | undefined;
		timeout?: number | undefined;
		failIfTimeout?: boolean | undefined;
		max?: number | undefined;
	}) => Promise<false | import("discord.js").Collection<string, import("discord.js").Message>>;
	/**
	 * The reaction function
	 * See [[reaction]]
	 */
	reaction: (channel: import("discord.js").TextChannel | import("discord.js").DMChannel, options?: {
		question: string;
		confirm?: string | import("discord.js").Emoji | import("discord.js").ReactionEmoji | undefined;
		cancel?: string | import("discord.js").Emoji | import("discord.js").ReactionEmoji | undefined;
		userId?: string | undefined;
		timeout?: number | undefined;
	}) => Promise<false | "yes" | "no">;
	/**
	 * The vote function
	 * See [[vote]]
	 */
	vote: (channel: import("discord.js").TextChannel | import("discord.js").DMChannel, options: {
		question: string;
		choices: import("discord.js").EmojiIdentifierResolvable[];
		timeout?: number | undefined;
		deleteMessage?: boolean | undefined;
	}) => Promise<{
		emojis: {
			emoji: import("discord.js").EmojiIdentifierResolvable;
			count: number;
		}[];
		total: number;
	}>;
	/**
	 * The choice function
	 * See [[choice]]
	 */
	choice: (channel: import("discord.js").TextChannel | import("discord.js").DMChannel, options: {
		question: string;
		choices: import("discord.js").EmojiIdentifierResolvable[];
		userId?: string | undefined;
		timeout?: number | undefined;
		deleteMessage?: boolean | undefined;
		acceptEarly?: boolean | undefined;
	}) => Promise<string | import("discord.js").Emoji | import("discord.js").ReactionEmoji | null>;
};
export default Prompter;

export {};
