import { message } from './message';
import { reaction } from './reaction';
import { vote } from './vote';

const Prompter = { message, reaction, vote };

export default Prompter;
module.exports = Prompter;
